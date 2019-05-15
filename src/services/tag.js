export function getTagList(input) {
    const {
        pageSize,
        currentPage: pageNum,
        name: attrName,
        tagCategoryId: tagId
    } = input
    return this.fetch({
        url: 'api/label/detail',
        params: {
            tagId,
            attrName,
            pageSize,
            pageNum
        }
    }).then((data) => {
        const {list: itemList, pageSize, pageNum: currentPage, total } = data.pageInfo
        return {
            itemList,
            pagination: {
                total,
                currentPage,
                pageSize
            }
        }
    })
}

export function upsertTag(input) {
    const url = input.attrId ? 'api/labelAttr/update' : 'api/labelAttr/save'
    return this.fetch({
        method: 'post',
        url,
        data: input
    })
}


export function deleteTag(input) {
    return this.fetch({
        method: 'post',
        url: 'api/labelAttr/del',
        data: input,
    })
}

export function tagBatchsave(input) {
    return this.fetch({
        method: 'post',
        url:'api/labelAttr/batchSave',
        data: input
    })
}

// 标签字典库
export function getTagDictDatabaseList(params) {
    return this.fetch({
        method: 'get',
        url:'api/tagDict/index',
        params
    })
}

