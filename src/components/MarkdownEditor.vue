<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <n-button-group size="small">
          <n-button
            v-for="tool in tools"
            :key="tool.name"
            quaternary
            :title="tool.title"
            @click="insertMarkdown(tool)"
          >
            <template #icon>
              <n-icon>
                <component :is="tool.icon" />
              </n-icon>
            </template>
          </n-button>
        </n-button-group>
      </div>
      <div class="toolbar-right">
        <n-button-group size="small">
          <n-button
            quaternary
            :type="showPreview ? 'default' : 'primary'"
            @click="toggleMode('edit')"
          >
            편집
          </n-button>
          <n-button
            quaternary
            :type="showPreview ? 'primary' : 'default'"
            @click="toggleMode('preview')"
          >
            미리보기
          </n-button>
        </n-button-group>
      </div>
    </div>

    <div class="editor-content" :class="{ 'preview-mode': showPreview }">
      <!-- Editor -->
      <div v-show="!showPreview" class="editor-panel">
        <textarea
          ref="textareaRef"
          v-model="content"
          :placeholder="placeholder"
          class="editor-textarea"
          @input="handleInput"
          @keydown="handleKeydown"
          @scroll="handleScroll"
        />
      </div>

      <!-- Preview -->
      <div v-show="showPreview" class="preview-panel">
        <div
          v-if="renderedContent"
          class="markdown-preview"
          v-html="renderedContent"
        />
        <div v-else class="preview-empty">
          <n-empty description="마크다운을 입력하면 미리보기가 표시됩니다" />
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <n-modal v-model:show="showImageModal">
      <n-card
        style="width: 500px"
        title="이미지 삽입"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-space vertical>
          <n-input
            v-model:value="imageUrl"
            placeholder="이미지 URL을 입력하세요"
            clearable
          />
          <n-input
            v-model:value="imageAlt"
            placeholder="이미지 설명 (선택사항)"
            clearable
          />
        </n-space>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showImageModal = false">취소</n-button>
            <n-button type="primary" @click="insertImage">삽입</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Link Modal -->
    <n-modal v-model:show="showLinkModal">
      <n-card
        style="width: 500px"
        title="링크 삽입"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-space vertical>
          <n-input
            v-model:value="linkUrl"
            placeholder="링크 URL을 입력하세요"
            clearable
          />
          <n-input
            v-model:value="linkText"
            placeholder="링크 텍스트를 입력하세요"
            clearable
          />
        </n-space>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showLinkModal = false">취소</n-button>
            <n-button type="primary" @click="insertLink">삽입</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useMessage } from 'naive-ui'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import {
  TextOutline,
  ListOutline,
  CodeOutline,
  ImageOutline,
  LinkOutline,
  GridOutline,
  ChatboxOutline,
  BookOutline
} from '@vicons/ionicons5'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '마크다운을 입력하세요...'
  },
  height: {
    type: String,
    default: '400px'
  }
})

const emit = defineEmits(['update:modelValue'])

const message = useMessage()
const textareaRef = ref(null)
const showPreview = ref(false)
const showImageModal = ref(false)
const showLinkModal = ref(false)
const imageUrl = ref('')
const imageAlt = ref('')
const linkUrl = ref('')
const linkText = ref('')

// Markdown-it 설정
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return ''
  }
})

// 툴바 도구들
const tools = [
  {
    name: 'heading',
    title: '제목 (Ctrl+1)',
    icon: BookOutline,
    markdown: '# '
  },
  {
    name: 'bold',
    title: '굵게 (Ctrl+B)',
    icon: TextOutline,
    markdown: '**굵은 텍스트**'
  },
  {
    name: 'italic',
    title: '기울임 (Ctrl+I)',
    icon: TextOutline,
    markdown: '_기울임 텍스트_'
  },
  {
    name: 'list',
    title: '목록',
    icon: ListOutline,
    markdown: '- 목록 항목\n'
  },
  {
    name: 'code',
    title: '코드 블록',
    icon: CodeOutline,
    markdown: '```\n코드\n```'
  },
  {
    name: 'quote',
    title: '인용문',
    icon: ChatboxOutline,
    markdown: '> 인용문\n'
  },
  {
    name: 'table',
    title: '표',
    icon: GridOutline,
    markdown: '| 헤더1 | 헤더2 |\n|-------|-------|\n| 내용1 | 내용2 |'
  },
  {
    name: 'image',
    title: '이미지',
    icon: ImageOutline,
    action: 'showImageModal'
  },
  {
    name: 'link',
    title: '링크',
    icon: LinkOutline,
    action: 'showLinkModal'
  }
]

const content = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const renderedContent = computed(() => {
  if (!content.value) return ''
  return md.render(content.value)
})

const handleInput = (event) => {
  content.value = event.target.value
}

const handleKeydown = (event) => {
  // 키보드 단축키 처리
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case '1':
        event.preventDefault()
        insertMarkdown({ markdown: '# ' })
        break
      case 'b':
        event.preventDefault()
        wrapSelection('**', '**')
        break
      case 'i':
        event.preventDefault()
        wrapSelection('_', '_')
        break
    }
  }

  // Tab 키 처리 (들여쓰기)
  if (event.key === 'Tab') {
    event.preventDefault()
    insertAtCursor('  ')
  }
}

const insertMarkdown = (tool) => {
  if (tool.action) {
    // 특별한 액션이 있는 경우 (이미지, 링크 등)
    if (tool.action === 'showImageModal') {
      showImageModal.value = true
    } else if (tool.action === 'showLinkModal') {
      showLinkModal.value = true
    }
  } else if (tool.markdown) {
    insertAtCursor(tool.markdown)
  }
}

const insertAtCursor = (text) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const before = content.value.substring(0, start)
  const after = content.value.substring(end)

  content.value = before + text + after

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + text.length, start + text.length)
  })
}

const wrapSelection = (prefix, suffix) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  const before = content.value.substring(0, start)
  const after = content.value.substring(end)

  const replacement = prefix + (selectedText || '텍스트') + suffix
  content.value = before + replacement + after

  nextTick(() => {
    textarea.focus()
    const newStart = start + prefix.length
    const newEnd = newStart + (selectedText || '텍스트').length
    textarea.setSelectionRange(newStart, newEnd)
  })
}

const toggleMode = (mode) => {
  showPreview.value = mode === 'preview'
}

const insertImage = () => {
  if (!imageUrl.value) {
    message.warning('이미지 URL을 입력해주세요')
    return
  }

  const alt = imageAlt.value || '이미지'
  const markdown = `![${alt}](${imageUrl.value})`
  insertAtCursor(markdown)

  // 모달 닫고 초기화
  showImageModal.value = false
  imageUrl.value = ''
  imageAlt.value = ''
}

const insertLink = () => {
  if (!linkUrl.value) {
    message.warning('링크 URL을 입력해주세요')
    return
  }

  const text = linkText.value || linkUrl.value
  const markdown = `[${text}](${linkUrl.value})`
  insertAtCursor(markdown)

  // 모달 닫고 초기화
  showLinkModal.value = false
  linkUrl.value = ''
  linkText.value = ''
}

const handleScroll = (event) => {
  // 미래에 동기화된 스크롤 구현을 위한 핸들러
}
</script>

<style scoped>
.markdown-editor {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  background: white;
  overflow: hidden;
  width: 100%;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: #f9fafb;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.editor-content {
  position: relative;
  height: v-bind(height);
}

.editor-panel,
.preview-panel {
  height: 100%;
  overflow: auto;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: white;
}

.preview-panel {
  padding: 16px;
  background: white;
}

.markdown-preview {
  max-width: none;
  color: #374151;
  line-height: 1.7;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #111827;
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.3em;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.3em;
}

.markdown-preview :deep(p) {
  margin-bottom: 1em;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-preview :deep(li) {
  margin-bottom: 0.25em;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  margin: 1em 0;
  padding-left: 1em;
  color: #6b7280;
  font-style: italic;
}

.markdown-preview :deep(pre) {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1em;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-preview :deep(code) {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.markdown-preview :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  margin-bottom: 1em;
  width: 100%;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
}

.markdown-preview :deep(th) {
  background: #f9fafb;
  font-weight: 600;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1em 0;
}

.markdown-preview :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

.preview-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

/* 다크 모드 지원 */
.dark-mode .markdown-editor {
  background: #374151;
  border-color: #4b5563;
}

.dark-mode .editor-toolbar {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .editor-textarea {
  background: #374151;
  color: #f3f4f6;
}

.dark-mode .preview-panel {
  background: #374151;
}

.dark-mode .markdown-preview {
  color: #f3f4f6;
}

.dark-mode .markdown-preview :deep(h1),
.dark-mode .markdown-preview :deep(h2),
.dark-mode .markdown-preview :deep(h3),
.dark-mode .markdown-preview :deep(h4),
.dark-mode .markdown-preview :deep(h5),
.dark-mode .markdown-preview :deep(h6) {
  color: #f9fafb;
}

.dark-mode .markdown-preview :deep(blockquote) {
  border-color: #6b7280;
  color: #d1d5db;
}

.dark-mode .markdown-preview :deep(pre) {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .markdown-preview :deep(code) {
  background: #4b5563;
}

.dark-mode .markdown-preview :deep(th),
.dark-mode .markdown-preview :deep(td) {
  border-color: #6b7280;
}

.dark-mode .markdown-preview :deep(th) {
  background: #4b5563;
}
</style>