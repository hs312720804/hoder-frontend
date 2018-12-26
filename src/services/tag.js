export function getTagList({tagCategoryId, name}) {
    return this.fetch({
        url: 'api/label/detail',
        params: {
            tagId: tagCategoryId,
            attrName: name
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
    const url = input.attrId ? 'api/labelAttr/modify' : 'api/labelAttr/add'
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