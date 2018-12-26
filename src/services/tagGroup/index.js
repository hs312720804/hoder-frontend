const cache = {
    tagTypeList: [],
    labelDataSourceEnum: []
}

export function getTagGroupList() {
    return this.fetch({
        url: 'api/label/index',
    }).then((data) => {
        if (cache.tagTypeList.length === 0) {
            const tagsTypeEnum = data.tagsTypeEnum
            cache.tagTypeList = Object.keys(tagsTypeEnum).map((key) => {
                return {
                    label: tagsTypeEnum[key],
                    value: key
                }
            })
        }
        cache.labelDataSourceEnum = data.labelDataSourceEnum
        return data.groupList.map((item) => {
            return {
                id: item.groupId,
                name: item.groupName
            }
        })
    })
}

export function createTagGroup(input) {
    return this.fetch({
        method: 'post',
        url: 'api/labelGroup/add',
        data: input,
    })
}

export function getTagTypeList() {
    return Promise.resolve(cache.tagTypeList)
}

export function getDataSourceEnum() {
    return Promise.resolve(cache.labelDataSourceEnum)
}