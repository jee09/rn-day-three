import React, { useState, useCallback, useEffect } from "react";
import { Dimensions, View } from "react-native";
import styled from "styled-components/native";

export default function Coins() {
  const [coins, setCoins] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getCoins = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    if (!refreshing) {
      getCoins();
    }
  };

  useEffect(() => {
    getCoins();
  }, [getCoins]);

  // Use this variable to access the data
  const cleanedCoins = coins
    .filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);

  const imgBaseUrl = "https://coinicons-api.vercel.app//api/icon/";

  return (
    <Container>
      <CoinList
        data={cleanedCoins}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        numColumns={3}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <CoinBox>
            <Img
              source={{ uri: `${imgBaseUrl}${item?.symbol.toLowerCase()}` }}
            />
            <CoinTitle>{item?.name}</CoinTitle>
          </CoinBox>
        )}
      />
    </Container>
  );
}
const windowWidth = Dimensions.get("window").width;
const itemWidth = (windowWidth - 40) / 3;

const Container = styled.View`
  flex: 1;
  background-color: #1e272e;
`;
const CoinList = styled.FlatList`
  flex: 1;
  padding: 0 5px;
`;

const CoinBox = styled.View`
  background-color: #26333b;
  width: ${itemWidth}px;
  height: ${itemWidth}px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin: 0 5px;
`;
const Img = styled.Image`
  width: 40px;
  height: 40px;
`;
const CoinTitle = styled.Text`
  font-size: 13px;
  color: white;
  margin-top: 10px;
  font-weight: 700;
  width: ${itemWidth - 30}px;
  text-align: center;
`;
