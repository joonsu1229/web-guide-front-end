import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useCategoryStore } from './useCategoryStore'
import { usePortalMenuStore } from './usePortalMenuStore'

export const useUtilStore = defineStore('util', () => {
	const categoryStore = useCategoryStore()
	const portalMenuStore = usePortalMenuStore()

	const flatCategoriesWithMenuTitle = computed(() => {
		const allCategories = categoryStore.categories
		const portalMenus = portalMenuStore.banners

		if (!allCategories?.length || !portalMenus?.length) {
			return []
		}

		// --- [1단계] 모든 카테고리에 menuTitle 미리 할당 ---
		const menuMapBySection = new Map(portalMenus.map(menu => [menu.section, menu.title]))
		const categoryMapById = new Map(allCategories.map(cat => [cat.id, cat]))
		const sectionCache = new Map()

		const findTopLevelSection = (categoryId) => {
			if (sectionCache.has(categoryId)) return sectionCache.get(categoryId)
			const category = categoryMapById.get(categoryId)
			if (!category) return null
			if (!category.parentId) {
				sectionCache.set(categoryId, category.section)
				return category.section
			}
			const topLevelSection = findTopLevelSection(category.parentId)
			sectionCache.set(categoryId, topLevelSection)
			return topLevelSection
		}

		const allCategoriesWithMenuTitle = allCategories.map(category => {
			const topLevelSection = findTopLevelSection(category.id)
			const menuTitle = menuMapBySection.get(topLevelSection) || '소속 메뉴 없음'
			return { ...category, menuTitle }
		})

		// --- [2단계] 데이터 구조화 (자식 그룹핑 및 최상위 노드 그룹핑) ---
		const childrenByParentId = new Map()
		const rootNodesByMenuTitle = new Map()

		allCategoriesWithMenuTitle.forEach(category => {
			// 자식 노드들을 부모 ID 기준으로 그룹핑
			if (category.parentId) {
				if (!childrenByParentId.has(category.parentId)) {
					childrenByParentId.set(category.parentId, [])
				}
				childrenByParentId.get(category.parentId).push(category)
			} else {
				// 최상위(1뎁스) 노드들을 menuTitle 기준으로 그룹핑
				if (!rootNodesByMenuTitle.has(category.menuTitle)) {
					rootNodesByMenuTitle.set(category.menuTitle, [])
				}
				rootNodesByMenuTitle.get(category.menuTitle).push(category)
			}
		})

		// --- [3단계] 메뉴 이름(menuTitle)을 기준으로 그룹 정렬 ---
		const sortedMenuTitles = [...rootNodesByMenuTitle.keys()].sort((a, b) => a.localeCompare(b))

		// --- [4단계] 정렬된 메뉴 그룹 순서에 따라 최종 목록 생성 ---
		const finalOrderedList = []
		
		// 재귀적으로 자식 노드를 찾아 리스트에 추가하는 함수
		const addChildrenToList = (parentId) => {
			const children = childrenByParentId.get(parentId)
			if (children) {
				// 같은 레벨의 자식들을 displayOrder 기준으로 정렬
				children.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
				for (const child of children) {
					finalOrderedList.push(child)
					addChildrenToList(child.id)
				}
			}
		}

		// 정렬된 메뉴 이름 순서대로 순회
		for (const menuTitle of sortedMenuTitles) {
			const rootNodes = rootNodesByMenuTitle.get(menuTitle)
			// 같은 메뉴에 속한 최상위 노드들을 displayOrder 기준으로 정렬
			rootNodes.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
			
			for (const rootNode of rootNodes) {
				finalOrderedList.push(rootNode) // 최상위 노드 추가
				addChildrenToList(rootNode.id) // 해당 노드의 자식들을 재귀적으로 추가
			}
		}

		return finalOrderedList
	})

	return {
		flatCategoriesWithMenuTitle
	}
})