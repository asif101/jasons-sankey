export const formatDataForVerticalStackedBar = rawData => {

    rawData[0].splice(0, 1)
    const intensities = rawData[0]
    const xLabels = []
    let yData = []


    console.log(rawData)
    rawData.splice(0, 1)
    rawData.splice(rawData.length - 1, 1)

    rawData.forEach((row, i) => {
        xLabels.push(row[0])
        const numValues = row.length - 1
        for (let j = 1; j <= numValues; j++) {
            if (!yData[j - 1]) yData[j - 1] = [getNum(row[j])]
            else yData[j - 1].push(getNum(row[j]))
        }
    })
    yData = yData.map((dataPoint, i) => {
        return {
            name: intensities[i],
            type: 'bar',
            stack: 'one',
            data: dataPoint
        }
    })

    console.log(yData)

    return makeOption({ xLabels, yData })
}


const makeOption = formattedData => {

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: formattedData.xLabels

        },
        yAxis: {
            type: 'value'
        },
        series: formattedData.yData
    }
}

const getNum = str => {
    if (str === '') return 0
    else return parseFloat(str)
}