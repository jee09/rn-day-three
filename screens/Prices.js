import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Prices() {
  const [tickers, setTickers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getTickers = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch("https://api.coinpaprika.com/v1/tickers");
      const json = await response.json();
      setTickers(json);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    if (!refreshing) {
      getTickers();
    }
  };

  useEffect(() => {
    getTickers();
  }, [getTickers]);

  // Use this variable to access the data
  const cleanedTickers = tickers.filter(
    (ticker) => ticker.circulating_supply !== 0
  );

  const imgBaseUrl = "https://coinicons-api.vercel.app//api/icon/";

  const renderItem = ({ item }) => {
    const currentPrice = item.quotes.USD.price.toFixed(2);
    const percentChange = item.quotes.USD.percent_change_24h.toFixed(2);
    const isNegative = percentChange < 0;
    const icon = isNegative ? "caret-down" : "caret-up";
    const color = isNegative ? "red" : "green";

    return (
      <Box>
        <RowContainer>
          <Img source={{ uri: `${imgBaseUrl}${item?.symbol.toLowerCase()}` }} />
          <Text>{item?.name}</Text>
        </RowContainer>
        <PricesContainer>
          <Text bold>${currentPrice}</Text>
          <RowContainer>
            <FontAwesome5
              name={icon}
              size={20}
              color={color}
              style={{ marginRight: 5 }}
            />
            <Text style={{ color }}>{percentChange}%</Text>
          </RowContainer>
        </PricesContainer>
      </Box>
    );
  };

  return (
    <Container>
      <PricesList
        data={cleanedTickers}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={renderItem}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #1e272e;
`;
const PricesList = styled.FlatList`
  padding: 0 10px;
`;
const Img = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;
const PricesContainer = styled.View`
  align-items: flex-end;
  flex-direction: column;
`;
const Box = styled.View`
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #393c3f;
  padding: 10px;
  flex-direction: row;
`;
const Text = styled.Text`
  color: #fff;
  font-weight: ${(props) => (props.bold ? "bold" : "500")};
  font-size: 13px;
`;
const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
