<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">매뉴얼 관리</h1>
        <p class="text-gray-600 mt-1">사용자 매뉴얼을 관리합니다</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <n-input
            v-model:value="searchQuery"
            placeholder="카테고리 이름으로 검색..."
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </div>
        <div class="flex gap-2">
          <n-select
            v-model:value="filterCategory"
            :options="categorySelectOptions"
            placeholder="메뉴 필터"
            class="w-40"
            clearable
            @update:value="handleFilter"
          />
          <n-button @click="handleRefresh" :loading="documentStore.isLoading">
            <template #icon>
              <n-icon>
                <RefreshOutline />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">총 매뉴얼 수</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalDocumentCount }}</p>
          </div>
          <n-icon size="24" color="#6366f1">
            <DocumentTextOutline />
          </n-icon>
        </div>
      </div>

      <div
        v-for="(menu, index) in topMenus"
        :key="menu.section"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">{{ menu.title }}</p>
            <p class="text-2xl font-bold" :class="getMenuColorClass(index)">{{ getMenuDocumentCount(menu.section) }}</p>
          </div>
          <n-icon size="24" :color="getMenuColor(index)">
            <DocumentTextOutline />
          </n-icon>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-4 py-5 sm:p-6">
        <n-data-table
          :columns="columns"
          :data="filteredCategories"
          :loading="categoryStore.isLoading"
          :pagination="paginationConfig"
          :row-key="(row) => row.id"
          size="medium"
          striped
        />
      </div>
    </div>

    <n-modal v-model:show="showCreateModal" :mask-closable="false">
      <n-card
        style="width: 80vw; max-width: 800px"
        :title="editingDocument ? '매뉴얼 수정' : '새 매뉴얼 추가'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="closeModal">
            <template #icon>
              <n-icon><CloseOutline /></n-icon>
            </template>
          </n-button>
        </template>

        <n-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-placement="top"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="메뉴" path="menu">
            <n-select
              v-model:value="formData.menu"
              :options="categorySelectOptions"
              placeholder="메뉴를 선택하세요"
              disabled
            />
          </n-form-item>

          <n-form-item label="카테고리" path="category">
            <n-select
              v-model:value="formData.category"
              :options="categoryOptions"
              placeholder="카테고리를 선택하세요"
              disabled
            />
          </n-form-item>

          <n-form-item label="설명" path="title">
            <n-input
              v-model:value="formData.title"
              placeholder="카테고리 설명을 입력하세요"
              :maxlength="500"
              show-count
            />
          </n-form-item>

          <n-form-item label="내용" path="content">
            <MarkdownEditor
              v-model="formData.content"
              placeholder="마크다운으로 매뉴얼 내용을 입력하세요"
              height="400px"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="closeModal">취소</n-button>
            <n-button
              type="primary"
              @click="handleSubmit"
              :loading="documentStore.isLoading"
            >
              {{ editingDocument ? '수정' : '생성' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showDeleteModal">
      <n-card
        style="width: 400px"
        title="매뉴얼 삭제 확인"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-space vertical>
          <n-text>정말로 이 매뉴얼을 삭제하시겠습니까?</n-text>
          <n-text strong>{{ deletingDocument?.title || deletingDocument?.name }}</n-text>
          <n-text depth="3" size="small">
            이 작업은 되돌릴 수 없습니다.
          </n-text>
        </n-space>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showDeleteModal = false">취소</n-button>
            <n-button
              type="error"
              @click="confirmDelete"
              :loading="documentStore.isLoading"
            >
              삭제
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showPreviewModal" :mask-closable="false">
      <n-card
        style="width: 80vw; max-width: 800px"
        title="매뉴얼 미리보기"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="showPreviewModal = false">
            <template #icon>
              <n-icon><CloseOutline /></n-icon>
            </template>
          </n-button>
        </template>

        <div v-if="previewDocument" class="space-y-4">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">메뉴</label>
              <n-input
                :value="previewDocument.menuTitle"
                readonly
                placeholder="메뉴"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <n-input
                :value="previewDocument.name"
                readonly
                placeholder="카테고리"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <n-input
                :value="previewDocument.description"
                readonly
                placeholder="설명"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <div class="border border-gray-200 rounded-md p-4 min-h-[400px] bg-gray-50">
                <div
                  v-if="previewContent"
                  class="markdown-preview text-gray-700 leading-relaxed prose max-w-none"
                  v-html="md.render(previewContent)"
                />
                <div v-else class="text-gray-500 italic">
                  내용이 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showPreviewModal = false">닫기</n-button>
            <n-button type="primary" @click="editDocument(previewDocument)">
              <template #icon>
                <n-icon><CreateOutline /></n-icon>
              </template>
              수정
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useMessage, NButton, NIcon, NTag, NText, NEllipsis } from 'naive-ui'
import { useDocumentStore } from '@/stores/documentStore'
import { usePortalMenuStore } from '@/stores/usePortalMenuStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useUtilStore } from '@/stores/useUtilStore'
import { useManualContentStore } from '@/stores/useManualContentStore'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import {
  AddOutline,
  SearchOutline,
  RefreshOutline,
  DocumentTextOutline,
  CodeOutline,
  ServerOutline,
  IdCardOutline,
  CloseOutline,
  CreateOutline,
  TrashOutline,
  EyeOutline
} from '@vicons/ionicons5'

// 스토어 인스턴스 생성
const message = useMessage()
const documentStore = useDocumentStore()
const portalMenuStore = usePortalMenuStore()
const categoryStore = useCategoryStore()
const utilStore = useUtilStore()
const manualContentStore = useManualContentStore()

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

// Reactive data
const searchQuery = ref('')
const filterCategory = ref('')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showPreviewModal = ref(false)
const editingDocument = ref(null)
const deletingDocument = ref(null)
const previewDocument = ref(null)
const previewContent = ref('')
const formRef = ref(null)

// Form data
const formData = ref({
  title: '',
  content: '',
  menu: '',
  category: ''
})

// Form rules
const formRules = {
  title: [
    { required: true, message: '설명을 입력해주세요', trigger: 'blur' },
    { min: 1, max: 500, message: '설명은 1-500자 사이여야 합니다', trigger: 'blur' }
  ],
  menu: [
    { required: true, message: '메뉴를 선택해주세요', trigger: 'change' }
  ],
  category: [
    { required: true, message: '카테고리를 선택해주세요', trigger: 'change' }
  ],
  content: [
    { required: true, message: '내용을 입력해주세요', trigger: 'blur' },
    { min: 10, max: 10000, message: '내용은 10-10000자 사이여야 합니다', trigger: 'blur' }
  ]
}

const categoryOptions = computed(() => {
  if (!categoryStore.categories || categoryStore.categories.length === 0) {
    return []
  }
  return categoryStore.categories.map(category => ({
    label: category.name || category.title,
    value: category.id.toString()
  }))
})

const categorySelectOptions = computed(() => {
  const options = [{ label: '전체', value: '' }]
  if (portalMenuStore.banners && portalMenuStore.banners.length > 0) {
    portalMenuStore.banners.forEach(menu => {
      options.push({
        label: menu.title,
        value: menu.title
      })
    })
  }
  return options
})

// Table configuration
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    align: 'center'
  },
  {
    title: '메뉴',
    key: 'menuTitle',
    width: 80,
    align: 'center'
  },  
  {
    title: '카테고리 이름',
    key: 'name',
    minWidth: 200,
    render: (row) => h(NEllipsis, { style: { maxWidth: '250px' } }, {
      default: () => row.name || row.title
    })
  },
  {
    title: '설명',
    key: 'description',
    minWidth: 250,
    render: (row) => h(NEllipsis, { style: { maxWidth: '300px' } }, {
      default: () => row.description || '-'
    })
  },
  {
    title: '상태',
    key: 'status',
    width: 100,
    align: 'center',
    render: (row) => h(NTag, {
      size: 'small',
      type: row.status === 'ACTIVE' ? 'success' : 'default'
    }, {
      default: () => row.status || 'ACTIVE'
    })
  },
  {
    title: '작성일',
    key: 'createdAt',
    width: 80,
    align: 'center'
  },
/*   {
    title: '날짜',
    key: 'date',
    width: 180,
    render: (row) => {
      const created = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'
      const updated = row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '-'
      return h('div', { class: 'text-xs' }, [
        h('div', `생성: ${created}`),
        h('div', { class: 'text-gray-500' }, `수정: ${updated}`)
      ])
    }
  }, */
  {
    title: '작업',
    key: 'actions',
    width: 180,
    align: 'center',
    render: (row) => [
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'info',
        onClick: () => previewDocumentHandler(row)
      }, {
        icon: () => h(NIcon, null, { default: () => h(EyeOutline) }),
        default: () => '보기'
      }),
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'primary',
        onClick: () => editDocument(row),
        style: { marginLeft: '4px' }
      }, {
        icon: () => h(NIcon, null, { default: () => h(CreateOutline) }),
        default: () => '수정'
      }),
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'error',
        onClick: () => deleteDocument(row),
        style: { marginLeft: '4px' }
      }, {
        icon: () => h(NIcon, null, { default: () => h(TrashOutline) }),
        default: () => '삭제'
      })
    ]
  }
]

const paginationConfig = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  showQuickJumper: true,
  prefix: ({ itemCount }) => `총 ${itemCount}개`
}

// Computed properties
const filteredCategories = computed(() => {
  let categories = utilStore.flatCategoriesWithMenuTitle || []

  // 메뉴 필터
  if (filterCategory.value) {
    categories = categories.filter(category =>
      category.menuTitle && category.menuTitle.includes(filterCategory.value)
    )
  }

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    categories = categories.filter(category =>
      (category.name && category.name.toLowerCase().includes(query)) ||
      (category.description && category.description.toLowerCase().includes(query)) ||
      (category.menuTitle && category.menuTitle.toLowerCase().includes(query))
    )
  }

  return categories
})

// Methods
const handleSearch = () => {}
const handleFilter = () => {}

const handleRefresh = async () => {
  try {
    await documentStore.fetchDocuments()
    message.success('매뉴얼 목록이 새로고침되었습니다')
  } catch (error) {
    message.error('새로고침 중 오류가 발생했습니다')
  }
}

const previewDocumentHandler = async (document) => {
  previewDocument.value = document
  previewContent.value = ''

  try {
    // 매뉴얼 내용 불러오기
    await manualContentStore.fetchContent('P1', document.id)
    previewContent.value = manualContentStore.currentContent?.contentBody || ''
  } catch (error) {
    console.error('매뉴얼 내용 불러오기 실패:', error)
    previewContent.value = ''
  }

  showPreviewModal.value = true
}

// [수정됨] editDocument 함수가 클릭된 행의 메뉴와 카테고리를 설정하도록 변경
const editDocument = async (document) => {
  editingDocument.value = document; // 수정 모드 활성화

  await manualContentStore.fetchContent('P1', document.id);

  // utilStore에서 제공하는 행 데이터는 id를 포함
  const parentId = document.id ? document.id.toString() : '';

  formData.value = {
    title: document.description || '',
    content: manualContentStore.currentContent?.contentBody || '',
    menu: document.menuTitle, // 행의 id를 사용
    category: document.id.toString() // 행의 카테고리 ID를 사용
  };
  showPreviewModal.value = false;
  showCreateModal.value = true;
}


const deleteDocument = (document) => {
  deletingDocument.value = document
  showPreviewModal.value = false
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await documentStore.deleteDocument(deletingDocument.value.id)
    message.success('매뉴얼이 삭제되었습니다')
    showDeleteModal.value = false
    deletingDocument.value = null
  } catch (error) {
    message.error('매뉴얼 삭제 중 오류가 발생했습니다')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    const sendData = {
      categoryId : formData.value.category,
      portalId: "P1",
      contentBody: formData.value.content
    }
    if (editingDocument.value) {
      await documentStore.createDocument(sendData)
      message.success('매뉴얼이 수정되었습니다')
    } else {
      await documentStore.createDocument(sendData)
      message.success('매뉴얼이 생성되었습니다')
    }
    closeModal()
  } catch (error) {
    message.error(error?.message || '양식을 확인해주세요')
  }
}

// [수정됨] openCreateModal 함수가 클릭된 행의 메뉴와 카테고리를 설정하도록 변경
const openCreateModal = (categoryRow) => {
  editingDocument.value = null; // 생성 모드이므로 수정 중인 문서는 null로 설정

  formData.value = {
    title: categoryRow.description,
    content: '',
    menu: categoryRow.menuTitle,
    category: categoryRow.name
  };
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false
  editingDocument.value = null
  
  // 폼 데이터 초기화
  formData.value = {
    title: '',
    content: '',
    menu: '',
    category: ''
  }
  formRef.value?.restoreValidation()
}

// 모든 메뉴 가져오기 (최대 8개까지)
const topMenus = computed(() => {
  console.log('portalMenuStore.banners:', portalMenuStore.banners)
  return portalMenuStore.banners || []
})

// 총 문서 개수
const totalDocumentCount = computed(() => {
  console.log('utilStore.flatCategoriesWithMenuTitle:', utilStore.flatCategoriesWithMenuTitle)
  return utilStore.flatCategoriesWithMenuTitle ? utilStore.flatCategoriesWithMenuTitle.length : 0
})

// 메뉴별 문서 개수 가져오기
const getMenuDocumentCount = (section) => {
  if (!utilStore.flatCategoriesWithMenuTitle) return 0
  // section을 title로 변환해서 매칭
  const menu = portalMenuStore.banners.find(m => m.section === section)
  if (!menu) {
    console.log('메뉴를 찾을 수 없음:', section)
    return 0
  }

  const count = utilStore.flatCategoriesWithMenuTitle.filter(category =>
    category.menuTitle === menu.title
  ).length

  console.log(`${menu.title} (${section}) 문서 개수:`, count)
  return count
}

// 메뉴별 색상 클래스
const getMenuColorClass = (index) => {
  const colors = ['text-green-600', 'text-blue-600', 'text-yellow-600']
  return colors[index] || 'text-gray-600'
}

// 메뉴별 아이콘 색상
const getMenuColor = (index) => {
  const colors = ['#10b981', '#3b82f6', '#f59e0b']
  return colors[index] || '#6366f1'
}

const getCategoryCount = (category) => {
  return documentStore.getDocumentsByCategory(category).length
}

const getCategoryColor = (category) => {
  const colors = {
    'technology': 'success',
    'database': 'info',
    'ai': 'warning',
    '': 'default'
  }
  return colors[category] || 'default'
}

// Lifecycle
onMounted(async () => {
  try {
    // 스토어의 액션을 병렬로 호출
    await Promise.all([
      categoryStore.fetchCategories('P1'),
      portalMenuStore.fetchPortalMenus('P1'),
      utilStore.structuredMenu
    ])
  } catch (error) {
    message.error('데이터를 불러오는 중 오류가 발생했습니다')
    console.error(error)
  }
})
</script>
<style scoped>
.prose {
  line-height: 1.7;
}

.prose p {
  margin-bottom: 1rem;
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
</style>