import React from 'react'
import ReactEcharts from 'echarts-for-react'
import Papa from 'papaparse'
import './App.css'

async function GetData() {
    const data = Papa.parse(await fetchCsv());
    return data;
}

async function fetchCsv() {
    const response = await fetch('data/data.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    return csv;
}

const colors = {
    NDP: 'rgb(255, 149, 0)',
    UCP: 'rgb(49, 153, 156)',
    AP: 'rgb(51, 102, 0)',
    LIB: 'rgb(192, 0, 0)',
    WR: 'rgb(102, 0, 255)',
    WRI: 'rgb(102, 0, 255)',
    UND: 'grey',
    NV: '#242937'
}

class App extends React.Component {

    nodes = []
    links = []

    state = {
        showChart: false
    }

    componentDidMount() {
        GetData().then(raw => {

            const makeNode = (nodeName) => {
                if (!this.nodes.map(x => x.name).includes(nodeName)) {
                    const partyName = nodeName.match(/[a-zA-Z]+/g)[0]
                    if (colors[partyName]) this.nodes.push({ name: nodeName, itemStyle: { color: colors[partyName] } })
                    else this.nodes.push({ name: nodeName })
                }
            }

            const makeLink = row => {
                const val = parseFloat(row[2])
                const partyName = row[0].match(/[a-zA-Z]+/g)[0]
                if (colors[partyName]) this.links.push({ source: row[0], target: row[1], value: val, lineStyle: { color: colors[partyName] } })
                else this.links.push({ source: row[0], target: row[1], value: val })
            }

            let data = raw.data
            data.splice(0, 1)
            data.splice(data.length - 1, 1)
            data.forEach(row => {
                makeNode(row[0])
                makeNode(row[1])
                makeLink(row)
            })



            console.log(data)
            console.log(this.nodes)
            console.log(this.links)
            this.setState({ showChart: true })
        })
    }

    getOption = () => {
        return {
            series: {
                type: 'sankey',
                layout: 'none',
                focusNodeAdjacency: 'allEdges',
                data: this.nodes,
                links: this.links
            }
        }
    }

    render() {
        console.log('render')
        const option = this.getOption()
        console.log(option)
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.showChart && <ReactEcharts className='chart' style={{ height: '600px' }} option={option} />}
                </header>
            </div>
        )
    }

}

export default App