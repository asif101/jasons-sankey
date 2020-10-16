import React from 'react'
import ReactEcharts from 'echarts-for-react'
import Papa from 'papaparse'
import { formatDataForSankey } from './utils/sankey'
import './App.css'

async function GetData() {
    const data = Papa.parse(await fetchCsv())
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


class App extends React.Component {

    echartOption = null

    state = {
        showChart: false
    }

    componentDidMount() {
        GetData().then(raw => {
            this.echartOption = formatDataForSankey(raw.data)
            this.setState({ showChart: true })
        })
    }


    render() {
        // console.log('render')
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.showChart &&
                        <ReactEcharts
                            className='chart'
                            style={{ height: Math.round(window.innerHeight * 0.9) + 'px' }}
                            option={this.echartOption}
                        />
                    }
                </header>
            </div>
        )
    }

}

export default App