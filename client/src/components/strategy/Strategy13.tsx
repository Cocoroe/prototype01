import { Table } from "antd";
import "antd/dist/antd.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { server_check, get_S13_coins, CurrentPrice } from "../../api/TableData";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: "20%",
    render: (name) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <img
            width="16px"
            height="16px"
            style={{ marginRight: "3px" }}
            alt="icon"
            src={`https://static.upbit.com/logos/${name}.png`}
            onError={(e) => {
              // e.currentTarget.src = "https://static.upbit.com/logos/BTC.png";
              e.currentTarget.style.display = "none";
            }}
          ></img>
          <span data-ticker={name}>{name}</span>
        </div>
      );
    },
  },
  {
    title: "Price",
    dataIndex: "show_price",
    sorter: {
      compare: (a, b) => a.price - b.price,
      multiple: 2,
    },
    width: "30%",
  },
  {
    title: "Change",
    dataIndex: "show_prev_compare",
    sorter: {
      compare: (a, b) => a.prev_compare - b.prev_compare,
      multiple: 2,
    },
    width: "30%",
    render: (text: string) =>
      text[0] !== "-" ? (
        <span style={{ color: "#26A69A" }}>{text}</span>
      ) : (
        <span style={{ color: "#EF5350" }}>{text}</span>
      ),
  },
  {
    title: "Moving Average",
    dataIndex: "show_bull",
    sorter: {
      compare: (a, b) => a.bull - b.bull,
      multiple: 2,
    },
    width: "20%",
    render: (text: number) =>
      text >= 1 ? (
        <span style={{ color: "#26A69A" }}>{text}</span>
      ) : (
        <span style={{ color: "#EF5350" }}>{text}</span>
      ),
  },
];

interface IStrategy13 {
  setSelectedTicker: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const Strategy13: React.FunctionComponent<IStrategy13> = ({
  setSelectedTicker,
}) => {
  type Row = {
    key: string;
    name: string;
    show_price: string;
    show_prev_compare: string;
    show_bull: string;
    price: string;
    prev_compare: number;
    bull: string;
  };
  const [dataSource, setData] = useState<Row[]>([]);
  const [fetchError,setFetchError ] = useState<boolean>(false);

  useEffect(() => {

    const fetchData = async  ()=>{
      try {
        await server_check(); 

        const data:[CurrentPrice] = await get_S13_coins();
        let arr: string[] = [];
        for (let key in data) {
          arr.push(key);
        }
        console.log("fetch data ",arr.length,data.length);
        let temp: Row[] = [];
        for (let i = 0; i < arr.length; i++) {
          let compare_number: number =
            ((data[arr[i]].closing_price - data[arr[i]].prev_closing_price) /
              data[arr[i]].prev_closing_price) *
            100;
          let compare: string = compare_number.toFixed(2);
          let bull: string = data[arr[i]].BULL_5
            ? data[arr[i]].BULL_5.toFixed(2)
            : "";
          let obj: Row = {
            key: `${i}`,
            name: arr[i],
            show_price: data[arr[i]].closing_price.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            ),
            show_prev_compare:
              compare.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%",
            show_bull: bull.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            price: data[arr[i]].closing_price,
            prev_compare: compare_number,
            bull: data[arr[i]].BULL_5,
          };
          temp.push(obj);
        }
        
        setData(temp);
      } catch (error) {
        console.log("fetch error")
        setFetchError(true)
      }
    }

    fetchData()
    const interval_fetch = setInterval(fetchData,10000)
    return ()=>{
      clearInterval(interval_fetch)
    }
  }, []);

  return (
    <TableStyled>
      <Table
        onRow={(record, rowIndex) => {
          return {
            // 행 클릭시 ticker 반환
            onClick: (event) => {
              const ticker =
                event.currentTarget.querySelector(
                  "span[data-ticker]"
                )?.innerHTML;
              // console.log(ticker);
              setSelectedTicker(ticker);
            }, // click row
            onDoubleClick: (event) => {}, // double click row
          };
        }}
        columns={columns}
        dataSource={ fetchError ? [] : dataSource }
        pagination={{ pageSize: 30 }}
      />
    </TableStyled>
  );
};

export default Strategy13;

const TableStyled = styled.div`
  /* header */
  .ant-table-cell {
    /* background-color: ${(props) => props.theme.blackColor1}; */
    /* color: ${(props) => props.theme.whiteColor1}; */
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    /* background-color: ${(props) => props.theme.blackColor2}; */
    /* color: ${(props) => props.theme.whiteColor1}; */
  }
`;
