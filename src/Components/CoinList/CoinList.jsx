import { useContext, useEffect, useState } from "react";
import { CryptoState } from "../../CryptoContext/CryptoContext";
import { CoinData } from "../../Config/api";
import axios from "axios";
import "./CoinList.css";
import {
  Container,
  LinearProgress,
  Pagination,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";


const CoinList = () => {
  const { currency, symbol } = useContext(CryptoState);
  const [coinSummary, setCoinSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  let [page, setPage] = useState(1);
  let [coinCount, setCoinCount] = useState(0);

  const fetchCoinData = async (currency) => {
    const { data } = await new Promise((res, rej) => {
      setTimeout(() => {
        try {
          res(axios.get(CoinData(currency)));
        } catch (err) {
          console.error(err);
        }
      }, 10);
    });
    setCoinSummary(data);
  };
  console.log(coinSummary);
  const handelSearch = () => {
    return coinSummary.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLocaleLowerCase())
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchCoinData(currency);
    setLoading(false);
  }, [currency]);

  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(2) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <Container className="coin_summary_contaner">
        <p
          style={{
            margin: "15px 0 10px 0px",
            fontFamily: "Montserrat",
            fontSize: "32px",
            fontWeight: "600",
            color: "#006f8f",
          }}
        >
          Get details of your coins with market cap
        </p>
        <TextField
          style={{ margin: "20px", width: "100%" }}
          varient="outlined"
          label="Search for you favourite coin.."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <TableContainer>
          {loading ? (
            <LinearProgress
              style={{ backgroundColor: "gold" }}
            ></LinearProgress>
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {[
                    "Rank",
                    "Coin",
                    "Price",
                    "24Hrs-Change-%",
                    `Market Cap ${symbol}`,
                  ].map((element) => {
                    return (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontFamily: "Montserrat",
                        }}
                        key={element}
                        //align={element === "coin" ? "" : "right"}
                      >
                        {element}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {handelSearch()
                  .map((row) => {
                    const profit = row?.price_change_percentage_24h;
                    return (
                      <TableRow
                        key={row.id}
                        onClick={() => {
                          navigate(`coins/${row?.id}`);
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row?.market_cap_rank}
                        </TableCell>
                        <TableCell
                          style={{
                            display: "flex",
                            gap: "15",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row?.name}
                            style={{ height: "30px" }}
                          />
                          <CoinName>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {row?.name}
                            </span>
                          </CoinName>
                        </TableCell>
                        <TableCell>
                          <CoinPrice>
                            <span style={{ fontSize: "14px" }}>
                              {symbol}
                              <span> {row?.current_price}</span>
                            </span>
                          </CoinPrice>
                        </TableCell>
                        <TableCell>
                          {profit > 0 ? (
                            <span
                              style={{ color: "green" }}
                            >{`+ ${profit}`}</span>
                          ) : (
                            <span style={{ color: "red" }}>{profit}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span>{numFormatter(row?.market_cap)}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          className="pagination_component"
          count={parseInt(handelSearch()?.length / 10).toFixed(0)}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 300);
          }}
        />
      </Container>
    </div>
  );
};
export default CoinList;

const CoinName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  margin: 5px;
  font-size: 12px;
`;
const CoinPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #ffffff;
  margin: 5px;
  font-size: 12px;
`;
