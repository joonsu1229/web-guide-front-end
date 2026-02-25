<template>
  <div class="space-y-6" :class="{ 'dark-mode': isDark }">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">시스템 관리</h1>
        <p class="mt-1" :class="isDark ? 'text-gray-300' : 'text-gray-600'">매뉴얼 및 카테고리를 관리합니다</p>
      </div>
    </div>

    <n-tabs type="line" animated>
      <n-tab-pane name="manuals" tab="매뉴얼 관리">
        <div class="space-y-6 mt-4">
          <div class="rounded-lg shadow-sm border p-4" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'">
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
            <!-- 로딩 상태일 때 스켈레톤 카드들 -->
            <template v-if="portalMenuStore.isLoading || utilStore.isLoading">
              <div v-for="i in 5" :key="i" class="rounded-lg shadow-sm border p-4 animate-pulse" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'">
                <div class="flex items-center">
                  <div class="flex-1 space-y-2">
                    <n-skeleton height="14px" width="70%" />
                    <n-skeleton height="32px" width="50%" />
                  </div>
                  <n-skeleton height="24px" width="24px" circle />
                </div>
              </div>
            </template>

            <!-- 실제 데이터 카드들 -->
            <template v-else>
              <div class="rounded-lg shadow-sm border p-4" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">총 매뉴얼 수</p>
                    <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalDocumentCount }}</p>
                  </div>
                  <n-icon size="24" color="#6366f1">
                    <DocumentTextOutline />
                  </n-icon>
                </div>
              </div>

              <div
                v-for="(menu, index) in topMenus"
                :key="menu.section"
                class="rounded-lg shadow-sm border p-4"
                :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'"
              >
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">{{ menu.title }}</p>
                    <p class="text-2xl font-bold" :class="getMenuColorClass(index)">{{ getMenuDocumentCount(menu.section) }}</p>
                  </div>
                  <n-icon size="24" :color="getMenuColor(index)">
                    <DocumentTextOutline />
                  </n-icon>
                </div>
              </div>
            </template>
          </div>

          <div class="rounded-lg shadow-sm border" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'">
            <div class="px-4 py-5 sm:p-6">
              <!-- 커스텀 로딩 상태 -->
              <div v-if="categoryStore.isLoading || utilStore.isLoading" class="space-y-6">
                <!-- 로딩 헤더 -->
                <div class="text-center py-8">
                  <div class="inline-flex flex-col items-center gap-4">
                    <div class="relative">
                      <div class="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <n-icon :size="20" color="#4f46e5" class="animate-pulse">
                          <DocumentTextOutline />
                        </n-icon>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <p class="text-base font-medium" :class="isDark ? 'text-gray-200' : 'text-gray-700'">매뉴얼 데이터 로딩 중...</p>
                      <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">잠시만 기다려주세요</p>
                    </div>
                  </div>
                </div>

                <!-- 테이블 스켈레톤 -->
                <div class="space-y-4">
                  <!-- 테이블 헤더 스켈레톤 -->
                  <div class="grid grid-cols-6 gap-4 p-4 rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
                    <n-skeleton height="20px" width="60px" />
                    <n-skeleton height="20px" width="80px" />
                    <n-skeleton height="20px" width="100px" />
                    <n-skeleton height="20px" width="120px" />
                    <n-skeleton height="20px" width="60px" />
                    <n-skeleton height="20px" width="80px" />
                  </div>

                  <!-- 테이블 행 스켈레톤 -->
                  <div v-for="i in 5" :key="i" class="grid grid-cols-6 gap-4 p-4 border-t animate-pulse" :class="isDark ? 'border-gray-600' : 'border-gray-200'">
                    <n-skeleton height="16px" width="40px" />
                    <n-skeleton height="16px" width="60px" />
                    <n-skeleton height="16px" width="90%" />
                    <n-skeleton height="16px" width="80%" />
                    <n-skeleton height="20px" width="60px" round />
                    <div class="flex gap-2">
                      <n-skeleton height="28px" width="50px" />
                      <n-skeleton height="28px" width="50px" />
                      <n-skeleton height="28px" width="50px" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 실제 데이터 테이블 -->
              <n-data-table
                v-else
                :columns="columns"
                :data="filteredCategories"
                :loading="false"
                :pagination="paginationConfig"
                :row-key="(row) => row.id"
                size="medium"
                striped
                :theme-overrides="isDark ? dataTableDarkTheme : {}"
              />
            </div>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="categories" tab="카테고리 관리">
        <div class="space-y-6 mt-4">
          <div class="flex justify-between items-center">
            <div class="flex-1 max-w-md">
              <n-input
                v-model:value="categorySearchQuery"
                placeholder="카테고리 이름으로 검색..."
                clearable
              >
                <template #prefix>
                  <n-icon><SearchOutline /></n-icon>
                </template>
              </n-input>
            </div>
            <n-button type="primary" @click="openCreateCategoryModal">
              <template #icon>
                <n-icon><AddOutline /></n-icon>
              </template>
              카테고리 등록
            </n-button>
          </div>

          <div class="rounded-lg shadow-sm border" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'">
            <n-data-table
              :columns="categoryColumns"
              :data="filteredRawCategories"
              :loading="categoryStore.isLoading"
              :pagination="paginationConfig"
              :row-key="(row) => row.id"
              size="medium"
              striped
              :theme-overrides="isDark ? dataTableDarkTheme : {}"
            />
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="menus" tab="메뉴 관리">
        <div class="space-y-6 mt-4">
          <div class="flex justify-between items-center">
            <div class="flex-1 max-w-md">
              <n-input
                v-model:value="menuSearchQuery"
                placeholder="메뉴 이름으로 검색..."
                clearable
              >
                <template #prefix>
                  <n-icon><SearchOutline /></n-icon>
                </template>
              </n-input>
            </div>
            <n-button type="primary" @click="openCreateMenuModal">
              <template #icon>
                <n-icon><AddOutline /></n-icon>
              </template>
              메뉴 등록
            </n-button>
          </div>

          <div class="rounded-lg shadow-sm border" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'">
            <n-data-table
              :columns="menuColumns"
              :data="filteredMenus"
              :loading="portalMenuStore.isLoading"
              :pagination="paginationConfig"
              :row-key="(row) => row.id"
              size="medium"
              striped
              :theme-overrides="isDark ? dataTableDarkTheme : {}"
            />
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>

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

    <!-- 카테고리 등록/수정 모달 -->
    <n-modal v-model:show="showCategoryModal" :mask-closable="false">
      <n-card
        style="width: 500px"
        :title="editingCategory ? '카테고리 수정' : '카테고리 등록'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="closeCategoryModal">
            <template #icon>
              <n-icon><CloseOutline /></n-icon>
            </template>
          </n-button>
        </template>

        <n-form
          ref="categoryFormRef"
          :model="categoryFormData"
          :rules="categoryFormRules"
          label-placement="top"
        >
          <n-form-item label="상위 메뉴" path="section">
            <n-select
              v-model:value="categoryFormData.section"
              :options="sectionOptions"
              placeholder="상위 메뉴를 선택하세요"
            />
          </n-form-item>

          <n-form-item label="카테고리 이름" path="name">
            <n-input
              v-model:value="categoryFormData.name"
              placeholder="카테고리 이름을 입력하세요"
            />
          </n-form-item>

          <n-form-item label="설명" path="description">
            <n-input
              v-model:value="categoryFormData.description"
              type="textarea"
              placeholder="카테고리 설명을 입력하세요"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </n-form-item>

          <n-form-item label="정렬 순서" path="displayOrder">
            <n-input-number
              v-model:value="categoryFormData.displayOrder"
              :min="1"
              class="w-full"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="closeCategoryModal">취소</n-button>
            <n-button
              type="primary"
              @click="handleCategorySubmit"
              :loading="categoryStore.isLoading"
            >
              {{ editingCategory ? '수정' : '등록' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- 카테고리 삭제 확인 모달 -->
    <n-modal v-model:show="showCategoryDeleteModal">
      <n-card
        style="width: 400px"
        title="카테고리 삭제 확인"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-space vertical>
          <n-text>정말로 이 카테고리를 삭제하시겠습니까?</n-text>
          <n-text strong>{{ deletingCategory?.name }}</n-text>
          <n-text depth="3" size="small">
            카테고리에 속한 매뉴얼 데이터가 있을 경우 삭제가 불가능할 수 있습니다.
          </n-text>
        </n-space>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showCategoryDeleteModal = false">취소</n-button>
            <n-button
              type="error"
              @click="confirmDeleteCategory"
              :loading="categoryStore.isLoading"
            >
              삭제
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- 메뉴 등록/수정 모달 -->
    <n-modal v-model:show="showMenuModal" :mask-closable="false">
      <n-card
        style="width: 500px"
        :title="editingMenu ? '메뉴 수정' : '메뉴 등록'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="closeMenuModal">
            <template #icon>
              <n-icon><CloseOutline /></n-icon>
            </template>
          </n-button>
        </template>

        <n-form
          ref="menuFormRef"
          :model="menuFormData"
          :rules="menuFormRules"
          label-placement="top"
        >
          <n-form-item label="메뉴 키(Section)" path="section">
            <n-input
              v-model:value="menuFormData.section"
              placeholder="메뉴의 고유 키를 입력하세요 (예: portal)"
              :disabled="!!editingMenu"
            />
          </n-form-item>

          <n-form-item label="메뉴 이름(Title)" path="title">
            <n-input
              v-model:value="menuFormData.title"
              placeholder="메뉴 이름을 입력하세요"
            />
          </n-form-item>

          <n-form-item label="설명" path="description">
            <n-input
              v-model:value="menuFormData.description"
              type="textarea"
              placeholder="메뉴 설명을 입력하세요"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </n-form-item>

          <n-form-item label="아이콘 키" path="icon">
            <n-input
              v-model:value="menuFormData.icon"
              placeholder="아이콘 키를 입력하세요"
            />
          </n-form-item>

          <n-form-item label="CSS 클래스" path="className">
            <n-input
              v-model:value="menuFormData.className"
              placeholder="CSS 클래스명을 입력하세요"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="closeMenuModal">취소</n-button>
            <n-button
              type="primary"
              @click="handleMenuSubmit"
              :loading="portalMenuStore.isLoading"
            >
              {{ editingMenu ? '수정' : '등록' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- 메뉴 삭제 확인 모달 -->
    <n-modal v-model:show="showMenuDeleteModal">
      <n-card
        style="width: 400px"
        title="메뉴 삭제 확인"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-space vertical>
          <n-text>정말로 이 메뉴를 삭제하시겠습니까?</n-text>
          <n-text strong>{{ deletingMenu?.title }}</n-text>
          <n-text depth="3" size="small">
            메뉴에 포함된 카테고리와 매뉴얼이 모두 삭제되거나 접근이 불가능해질 수 있습니다.
          </n-text>
        </n-space>

        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button @click="showMenuDeleteModal = false">취소</n-button>
            <n-button
              type="error"
              @click="confirmDeleteMenu"
              :loading="portalMenuStore.isLoading"
            >
              삭제
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useMessage, NButton, NIcon, NTag, NText, NEllipsis, NInputNumber } from 'naive-ui'
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

// Props
const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

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

// 카테고리 관리 관련 상태
const categorySearchQuery = ref('')
const showCategoryModal = ref(false)
const showCategoryDeleteModal = ref(false)
const editingCategory = ref(null)
const deletingCategory = ref(null)
const categoryFormRef = ref(null)

// 메뉴 관리 관련 상태
const menuSearchQuery = ref('')
const showMenuModal = ref(false)
const showMenuDeleteModal = ref(false)
const editingMenu = ref(null)
const deletingMenu = ref(null)
const menuFormRef = ref(null)

// Form data
const formData = ref({
  title: '',
  content: '',
  menu: '',
  category: ''
})

// 카테고리 폼 데이터
const categoryFormData = ref({
  name: '',
  description: '',
  displayOrder: 1,
  section: 'portal',
  portalId: 'P1'
})

// 메뉴 폼 데이터
const menuFormData = ref({
  section: '',
  title: '',
  description: '',
  icon: 'portal',
  className: '',
  portalId: 'P1'
})

// 다크모드용 데이터 테이블 테마
const dataTableDarkTheme = {
  common: {
    tableColor: '#2d3748',
    tableColorHover: '#4a5568',
    tableHeaderColor: '#1a202c',
    textColor: '#e2e8f0',
    textColorDisabled: '#a0aec0',
    borderColor: '#4a5568'
  },
  DataTable: {
    tdColor: '#2d3748',
    tdColorHover: '#4a5568',
    tdColorStriped: '#374151',
    thColor: '#1a202c',
    thColorHover: '#2d3748',
    borderColor: '#4a5568',
    textColor: '#e2e8f0',
    thTextColor: '#f7fafc',
    tdTextColor: '#e2e8f0'
  }
}

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

// 카테고리 폼 규칙
const categoryFormRules = {
  name: [
    { required: true, message: '카테고리 이름을 입력해주세요', trigger: 'blur' }
  ],
  section: [
    { required: true, message: '상위 메뉴를 선택해주세요', trigger: 'change' }
  ],
  displayOrder: [
    { required: true, type: 'number', message: '정렬 순서를 입력해주세요', trigger: 'blur' }
  ]
}

// 메뉴 폼 규칙
const menuFormRules = {
  section: [
    { required: true, message: '메뉴 키(section)를 입력해주세요', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '메뉴 이름을 입력해주세요', trigger: 'blur' }
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

const sectionOptions = computed(() => {
  if (portalMenuStore.banners && portalMenuStore.banners.length > 0) {
    return portalMenuStore.banners.map(menu => ({
      label: menu.title,
      value: menu.section
    }))
  }
  return [
    { label: '포탈', value: 'portal' },
    { label: '전자결재', value: 'approval' },
    { label: '메일', value: 'mail' }
  ]
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

// 카테고리 관리 테이블 컬럼
const categoryColumns = [
  { title: 'ID', key: 'id', width: 80, align: 'center' },
  { 
    title: '상위 메뉴', 
    key: 'section', 
    width: 120,
    render: (row) => {
      const section = sectionOptions.value.find(s => s.value === row.section)
      return section ? section.label : row.section
    }
  },
  { title: '카테고리 이름', key: 'name', minWidth: 150 },
  { title: '설명', key: 'description', minWidth: 200, ellipsis: { tooltip: true } },
  { title: '순서', key: 'displayOrder', width: 70, align: 'center' },
  {
    title: '작업',
    key: 'actions',
    width: 150,
    align: 'center',
    render: (row) => [
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'primary',
        onClick: () => editCategory(row)
      }, {
        icon: () => h(NIcon, null, { default: () => h(CreateOutline) }),
        default: () => '수정'
      }),
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'error',
        onClick: () => deleteCategory(row),
        style: { marginLeft: '4px' }
      }, {
        icon: () => h(NIcon, null, { default: () => h(TrashOutline) }),
        default: () => '삭제'
      })
    ]
  }
]

// 메뉴 관리 테이블 컬럼
const menuColumns = [
  { title: 'ID', key: 'id', width: 80, align: 'center' },
  { title: '키(section)', key: 'section', width: 120 },
  { title: '메뉴 이름', key: 'title', width: 120 },
  { title: '설명', key: 'description', minWidth: 200, ellipsis: { tooltip: true } },
  { title: '아이콘', key: 'icon', width: 150 },
  {
    title: '작업',
    key: 'actions',
    width: 200,
    align: 'center',
    render: (row) => [
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'primary',
        onClick: () => editMenu(row)
      }, {
        icon: () => h(NIcon, null, { default: () => h(CreateOutline) }),
        default: () => '수정'
      }),
      h(NButton, {
        size: 'small',
        quaternary: true,
        type: 'error',
        onClick: () => deleteMenu(row),
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

// 카테고리 관리 탭 필터링된 데이터
const filteredRawCategories = computed(() => {
  let categories = categoryStore.categories || []
  
  if (categorySearchQuery.value) {
    const query = categorySearchQuery.value.toLowerCase().trim()
    categories = categories.filter(c => 
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      (c.section && c.section.toLowerCase().includes(query))
    )
  }
  
  return categories
})

// 메뉴 관리 탭 필터링된 데이터
const filteredMenus = computed(() => {
  let menus = portalMenuStore.banners || []
  
  if (menuSearchQuery.value) {
    const query = menuSearchQuery.value.toLowerCase().trim()
    menus = menus.filter(m => 
      (m.title && m.title.toLowerCase().includes(query)) ||
      (m.description && m.description.toLowerCase().includes(query)) ||
      (m.section && m.section.toLowerCase().includes(query))
    )
  }
  
  return menus
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

// editDocument 함수가 클릭된 행의 메뉴와 카테고리를 설정하도록 변경
const editDocument = async (document) => {
  editingDocument.value = document; // 수정 모드 활성화

  await manualContentStore.fetchContent('P1', document.id);

  formData.value = {
    title: document.description || '',
    content: manualContentStore.currentContent?.contentBody || '',
    menu: document.menuTitle, 
    category: document.id.toString() 
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
      menu: formData.value.menu,
      title: formData.value.title,
      portalId: "P1",
      contentBody: formData.value.content
    }
    
    await documentStore.createDocument(sendData)
    message.success(editingDocument.value ? '매뉴얼이 수정되었습니다' : '매뉴얼이 생성되었습니다')
    
    closeModal()
  } catch (error) {
    message.error(error?.message || '양식을 확인해주세요')
  }
}

const openCreateModal = (categoryRow) => {
  editingDocument.value = null; 

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
  
  formData.value = {
    title: '',
    content: '',
    menu: '',
    category: ''
  }
  formRef.value?.restoreValidation()
}

// 카테고리 관리 메서드들
const openCreateCategoryModal = () => {
  editingCategory.value = null
  categoryFormData.value = {
    name: '',
    description: '',
    displayOrder: 1,
    section: 'portal',
    portalId: 'P1'
  }
  showCategoryModal.value = true
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryFormData.value = {
    name: category.name,
    description: category.description || '',
    displayOrder: category.displayOrder || 1,
    section: category.section || 'portal',
    portalId: category.portalId || 'P1'
  }
  showCategoryModal.value = true
}

const deleteCategory = (category) => {
  deletingCategory.value = category
  showCategoryDeleteModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
  categoryFormRef.value?.restoreValidation()
}

const handleCategorySubmit = async () => {
  try {
    await categoryFormRef.value?.validate()
    
    if (editingCategory.value) {
      // 수정 시 규격: /api/categories/{id}?portalId=P1
      await categoryStore.updateCategory(
        editingCategory.value.id, 
        categoryFormData.value.portalId, 
        {
          name: categoryFormData.value.name,
          description: categoryFormData.value.description,
          displayOrder: categoryFormData.value.displayOrder
        }
      )
      message.success('카테고리가 수정되었습니다')
    } else {
      // 생성 시 규격: Body에 portalId 포함
      await categoryStore.createCategory(categoryFormData.value)
      message.success('카테고리가 등록되었습니다')
    }
    
    closeCategoryModal()
    // 목록 새로고침
    await categoryStore.fetchCategories('P1')
  } catch (error) {
    message.error(error?.message || '양식을 확인해주세요')
  }
}

const confirmDeleteCategory = async () => {
  try {
    await categoryStore.deleteCategory(deletingCategory.value.id, 'P1')
    message.success('카테고리가 삭제되었습니다')
    showCategoryDeleteModal.value = false
    deletingCategory.value = null
    await categoryStore.fetchCategories('P1')
  } catch (error) {
    message.error(error?.message || '삭제 중 오류가 발생했습니다')
  }
}

// 메뉴 관리 메서드들
const openCreateMenuModal = () => {
  editingMenu.value = null
  menuFormData.value = {
    section: '',
    title: '',
    description: '',
    icon: 'portal',
    className: '',
    portalId: 'P1'
  }
  showMenuModal.value = true
}

const editMenu = (menu) => {
  editingMenu.value = menu
  menuFormData.value = {
    section: menu.section,
    title: menu.title,
    description: menu.description || '',
    icon: menu.icon || 'portal',
    className: menu.className || '',
    portalId: menu.portalId || 'P1'
  }
  showMenuModal.value = true
}

const deleteMenu = (menu) => {
  deletingMenu.value = menu
  showMenuDeleteModal.value = true
}

const closeMenuModal = () => {
  showMenuModal.value = false
  editingMenu.value = null
  menuFormRef.value?.restoreValidation()
}

const handleMenuSubmit = async () => {
  try {
    await menuFormRef.value?.validate()
    
    if (editingMenu.value) {
      await portalMenuStore.updatePortalMenu(editingMenu.value.id, menuFormData.value)
      message.success('메뉴가 수정되었습니다')
    } else {
      await portalMenuStore.createPortalMenu(menuFormData.value)
      message.success('메뉴가 등록되었습니다')
    }
    
    closeMenuModal()
    await portalMenuStore.fetchPortalMenus('P1')
  } catch (error) {
    message.error(error?.message || '양식을 확인해주세요')
  }
}

const confirmDeleteMenu = async () => {
  try {
    await portalMenuStore.deletePortalMenu(deletingMenu.value.id, 'P1')
    message.success('메뉴가 삭제되었습니다')
    showMenuDeleteModal.value = false
    deletingMenu.value = null
    await portalMenuStore.fetchPortalMenus('P1')
  } catch (error) {
    message.error(error?.message || '삭제 중 오류가 발생했습니다')
  }
}

// 모든 메뉴 가져오기 (최대 8개까지)
const topMenus = computed(() => {
  return portalMenuStore.banners || []
})

// 총 문서 개수
const totalDocumentCount = computed(() => {
  return utilStore.flatCategoriesWithMenuTitle ? utilStore.flatCategoriesWithMenuTitle.length : 0
})

// 메뉴별 문서 개수 가져오기
const getMenuDocumentCount = (section) => {
  if (!utilStore.flatCategoriesWithMenuTitle) return 0
  const menu = portalMenuStore.banners.find(m => m.section === section)
  if (!menu) return 0

  return utilStore.flatCategoriesWithMenuTitle.filter(category =>
    category.menuTitle === menu.title
  ).length
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

// Lifecycle
onMounted(async () => {
  try {
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

/* 다크모드 스타일 */
.dark-mode {
  background-color: #1a1d21;
  color: #e9ecef;
}

.dark-mode .space-y-6 {
  background-color: #1a1d21;
}
</style>