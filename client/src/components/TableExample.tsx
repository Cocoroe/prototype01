import { Table } from 'antd';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import {server_check, get_current_price} from '../api/TableData'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: 'Price',
    dataIndex: 'show_price',
    sorter: {
      compare: (a, b) => a.price - b.price,
      multiple: 2,
    },
    width: '30%',
  },
  {
    title: 'Change',
    dataIndex: 'show_prev_compare',
    sorter: {
      compare: (a, b) => a.prev_compare - b.prev_compare,
      multiple: 2,
    },
    width: '30%',
    render: (text: string) => (text[0]!=='-') ? <a style={{color: '#05c545'}}>{text}</a> : <a style={{color: '#ff3d00'}}>{text}</a>,
  },
  {
    title: 'Moving Average',
    dataIndex: 'show_bull',
    sorter: {
      compare: (a, b) => a.bull - b.bull,
      multiple: 2,
    },
    width: '20%',
    render: (text: number) => (text >= 1) ? <a style={{color: '#05c545'}}>{text}</a> : <a style={{color: '#ff3d00'}}>{text}</a>,
  },
];

const TableExample = () => {
  type Row = {
    key: string, 
    name: string, 
    show_price: string, 
    show_prev_compare: string, 
    show_bull: string, 
    price: string, 
    prev_compare: number, 
    bull: string
  };
  const [dataSource, setData] = useState<Row[]>([]);
  useEffect(() => {
    (async () => {
      await server_check();
      const data = await get_current_price();
      let arr: string[] = [];
      for (let key in data) {
        arr.push(key);
      }
      let temp: Row[] = [];
      for (let i = 0; i < arr.length; i++){
        let compare_number: number = (data[arr[i]].closing_price-data[arr[i]].prev_closing_price)/data[arr[i]].prev_closing_price*100
        let compare:string = compare_number.toFixed(2);
        let bull:string = data[arr[i]].BULL_5? data[arr[i]].BULL_5.toFixed(2) : '';
        let obj: Row = {
          key: `${i}`,
          name: arr[i], 
          show_price: data[arr[i]].closing_price.replace(/\B(?=(\d{3})+(?!\d))/g, ','), 
          show_prev_compare: compare.replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'%', 
          show_bull: bull.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          price: data[arr[i]].closing_price, 
          prev_compare: compare_number, 
          bull: data[arr[i]].BULL_5
        }
        temp.push(obj);
      }
      setData(temp);
    })();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={dataSource}/>
    </div>
  );
};

export default TableExample;