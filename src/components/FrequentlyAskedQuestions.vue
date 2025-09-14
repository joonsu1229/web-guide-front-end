<template>
  <div class="faq-section" :class="{ 'dark-mode': isDark }">
    <div class="faq-container">
      <h2 class="faq-title">자주 묻는 질문과 답변을 모아봤어요.</h2>

      <div class="faq-tags">
        <button
          v-for="tag in tags"
          :key="tag.id"
          class="faq-tag"
          :class="{ active: activeTag === tag.id }"
          @click="setActiveTag(tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>

      <div class="faq-grid">
        <div
          v-for="faq in filteredFaqs"
          :key="faq.id"
          class="faq-card"
          @click="toggleFaq(faq.id)"
        >
          <div class="faq-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 17H12.01"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="faq-content">
            <h3 class="faq-question">{{ faq.question }}</h3>
            <div class="faq-answer" :class="{ 'expanded': openFaqs.includes(faq.id) }">
              <p class="faq-answer-text">{{ faq.answer }}</p>
            </div>
          </div>
          <div class="faq-arrow" :class="{ 'rotated': openFaqs.includes(faq.id) }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FrequentlyAskedQuestions',
  props: {
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTag: 'all',
      openFaqs: [],
      tags: [
        { id: 'all', name: '전체' },
        { id: 'portal', name: '포탈(Portal)' },
        { id: 'approval', name: '전자결재' },
        { id: 'ehr', name: 'E-HR' },
        { id: 'mobile', name: '모바일' }
      ],
      faqs: [
        {
          id: 1,
          question: '워크쓰루 계정은 어떻게 만드나요?',
          answer: '관리자가 초대를 보내면 이메일로 초대 링크를 받을 수 있습니다. 초대 메일의 "지금 시작하기" 버튼을 클릭하여 계정을 활성화하고 비밀번호를 설정하시면 바로 사용할 수 있습니다.',
          category: 'portal'
        },
        {
          id: 2,
          question: '포탈 화면을 개인화할 수 있나요?',
          answer: '네, 포틀릿을 자유롭게 배치하고 개인 대시보드로 꾸밀 수 있습니다. 우측 상단의 설정 버튼을 클릭하여 원하는 포틀릿을 선택하고 드래그앤드롭으로 위치를 조정할 수 있습니다.',
          category: 'portal'
        },
        {
          id: 3,
          question: '포틀릿은 어떻게 추가하고 제거하나요?',
          answer: '포탈 설정에서 원하는 포틀릿을 선택하고 드래그앤드롭으로 배치할 수 있습니다. 사용하지 않는 포틀릿은 X 버튼을 클릭해서 제거하거나 설정에서 체크박스를 해제하여 숨길 수 있습니다.',
          category: 'portal'
        },
        {
          id: 4,
          question: '전자결재 양식은 어떻게 만드나요?',
          answer: '양식 생성기를 통해 손쉽게 결재 양식을 만들고 관리할 수 있습니다. 관리자 메뉴에서 "양식 관리"로 들어가서 드래그앤드롭 방식으로 필요한 항목들을 배치하여 양식을 생성할 수 있습니다.',
          category: 'approval'
        },
        {
          id: 5,
          question: '결재 진행 상황은 어떻게 확인하나요?',
          answer: '내 문서함에서 진행 중인 결재의 현재 단계와 상태를 실시간으로 확인할 수 있습니다. 각 결재자의 처리 현황과 결재일, 의견 등도 상세하게 볼 수 있습니다.',
          category: 'approval'
        },
        {
          id: 6,
          question: '결재 라인은 어떻게 설정하나요?',
          answer: '조직도를 기반으로 결재 라인을 설정하고 저장해서 재사용할 수 있습니다. 자주 사용하는 결재 라인은 "즐겨찾기"로 등록하여 빠르게 선택할 수 있습니다.',
          category: 'approval'
        },
        {
          id: 7,
          question: '출퇴근 기록은 어떻게 확인하나요?',
          answer: 'e-HR에서 근태 현황과 월별 근무 시간을 확인할 수 있습니다. 일별, 주별, 월별 통계와 함께 초과근무 시간, 지각/조퇴 내역도 한눈에 볼 수 있습니다.',
          category: 'ehr'
        },
        {
          id: 8,
          question: '연차는 어떻게 신청하나요?',
          answer: 'e-HR의 연차 신청 메뉴에서 날짜를 선택하고 신청할 수 있습니다. 반차, 연차, 대체휴가 등 다양한 휴가 유형을 선택할 수 있고, 승인 후 자동으로 일정에 반영됩니다.',
          category: 'ehr'
        },
        {
          id: 9,
          question: '야근/휴일근무 신청은 어떻게 하나요?',
          answer: '근무 계획에서 사전에 신청하거나 사후 승인 요청을 할 수 있습니다. 52시간 근무제에 따른 주간/월간 한도도 자동으로 체크되어 안전하게 관리됩니다.',
          category: 'ehr'
        },
        {
          id: 10,
          question: '모바일에서도 사용할 수 있나요?',
          answer: '네, 모바일 웹과 앱을 통해 언제 어디서나 접속 가능합니다. iOS와 Android 앱 모두 제공되며, 모바일에 최적화된 인터페이스로 편리하게 이용할 수 있습니다.',
          category: 'mobile'
        },
        {
          id: 11,
          question: '모바일에서 알림 설정은 어떻게 하나요?',
          answer: '앱 설정에서 받고 싶은 알림 유형을 선택하고 푸시 알림을 설정할 수 있습니다. 결재 요청, 메시지, 일정 등 각각 개별적으로 알림 설정이 가능합니다.',
          category: 'mobile'
        },
        {
          id: 12,
          question: '모바일에서도 결재가 가능한가요?',
          answer: '네, 모바일에서도 문서 확인과 결재 승인/반려가 모두 가능합니다. 외부에서도 빠르게 결재 처리를 할 수 있어 업무 효율성이 크게 향상됩니다.',
          category: 'mobile'
        }
      ]
    }
  },
  computed: {
    filteredFaqs() {
      if (this.activeTag === 'all') {
        return this.faqs
      }
      return this.faqs.filter(faq => faq.category === this.activeTag)
    }
  },
  methods: {
    toggleFaq(faqId) {
      const index = this.openFaqs.indexOf(faqId)
      if (index > -1) {
        this.openFaqs.splice(index, 1)
      } else {
        this.openFaqs.push(faqId)
      }
    },
    setActiveTag(tagId) {
      this.activeTag = tagId
      // 태그 변경 시 모든 FAQ 닫기
      this.openFaqs = []
    }
  }
}
</script>

<style scoped>
.faq-section {
  background-color: #f1f3f9;
  padding: 80px 0;
  margin: 40px 0;
  transition: all 0.3s ease;
}

.faq-section.dark-mode {
  background-color: #1f2937;
}

.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.faq-title {
  font-size: 38px;
  font-weight: 700;
  color: #202936;
  text-align: center;
  margin: 0 0 30px 0;
  line-height: 48px;
  letter-spacing: -0.5px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

.faq-section.dark-mode .faq-title {
  color: #f9fafb;
}

.faq-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0 0 50px 0;
  flex-wrap: wrap;
}

.faq-tag {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.faq-tag:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.faq-tag.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
}

.faq-section.dark-mode .faq-tag {
  background: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.faq-section.dark-mode .faq-tag:hover {
  border-color: #8b5cf6;
  color: #a78bfa;
}

.faq-section.dark-mode .faq-tag.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: #ffffff;
}

.faq-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.faq-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex-direction: row;
}

.faq-card:hover {
  background: #f9fafc;
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.faq-card:hover .faq-icon {
  transform: scale(1.2);
  color: #4f46e5;
}

.faq-section.dark-mode .faq-card {
  background: #374151;
  border-color: rgba(255, 255, 255, 0.1);
}

.faq-section.dark-mode .faq-card:hover {
  background: #4b5563;
}

.faq-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #6366f1;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.faq-content {
  flex: 1;
}

.faq-question {
  font-size: 16px;
  font-weight: 600;
  color: #202124;
  margin: 0;
  line-height: 24px;
  letter-spacing: -0.3px;
}

.faq-section.dark-mode .faq-question {
  color: #f9fafb;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  margin-top: 0;
}

.faq-answer.expanded {
  max-height: 200px;
  margin-top: 12px;
}

.faq-answer-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 20px;
  letter-spacing: -0.2px;
  padding-top: 8px;
}

.faq-section.dark-mode .faq-answer-text {
  color: #9ca3af;
}


.faq-arrow {
  flex-shrink: 0;
  color: #9ca3af;
  transition: all 0.3s ease;
  transform: rotate(0deg);
}

.faq-arrow.rotated {
  transform: rotate(180deg);
  color: #6366f1;
}

.faq-card:hover .faq-arrow {
  color: #6366f1;
}

@media (max-width: 768px) {
  .faq-section {
    padding: 60px 0;
    margin: 30px 0;
  }

  .faq-container {
    padding: 0 16px;
  }

  .faq-title {
    font-size: 28px;
    line-height: 36px;
    margin-bottom: 20px;
  }

  .faq-tags {
    gap: 8px;
    margin-bottom: 30px;
  }

  .faq-tag {
    padding: 6px 16px;
    font-size: 13px;
  }

  .faq-grid {
    gap: 12px;
  }

  .faq-card {
    padding: 16px;
    gap: 12px;
  }

  .faq-question {
    font-size: 15px;
  }

}
</style>