const colors = {
    NDP: 'rgb(255, 149, 0)',
    UCP: 'rgb(49, 153, 156)',
    PC: 'rgb(49, 153, 156)',
    AP: 'rgb(51, 102, 0)',
    LIB: 'rgb(192, 0, 0)',
    WR: 'rgb(102, 0, 255)',
    WRI: 'rgb(102, 0, 255)',
    UND: 'grey',
    NV: '#242937'
}

export const formatDataForSankey = rawData => {

    const nodes = []
    const links = []

    const makeNode = (nodeName) => {
        if (!nodes.map(x => x.name).includes(nodeName)) {
            const partyName = nodeName.match(/[a-zA-Z]+/g)[0]
            if (colors[partyName]) nodes.push({ name: nodeName, itemStyle: { color: colors[partyName] } })
            else this.nodes.push({ name: nodeName })
        }
    }

    const makeLink = row => {
        const val = parseFloat(row[2])
        const partyName = row[0].match(/[a-zA-Z]+/g)[0]
        if (colors[partyName]) links.push({ source: row[0], target: row[1], value: val, lineStyle: { color: colors[partyName] } })
        else links.push({ source: row[0], target: row[1], value: val })
    }

    rawData.splice(0, 1)
    rawData.splice(rawData.length - 1, 1)
    rawData.forEach(row => {
        makeNode(row[0])
        makeNode(row[1])
        makeLink(row)
    })

    console.log(nodes)
    console.log(links)

    return makeOption({ nodes, links })

}

const makeOption = formattedData => {
    return {
        series: {
            type: 'sankey',
            layout: 'none',
            focusNodeAdjacency: 'allEdges',
            data: formattedData.nodes,
            links: formattedData.links
        }
    }
}
