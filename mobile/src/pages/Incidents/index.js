import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import api from "../../services/api";

import logoImg from "../../assets/logo.png";
export default function Incidents() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident });
  }

  function loadIncidents() {
    console.log(total);
    console.log(incidents.length);
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length === total) {
      console.warn("parei com as requisições");
      return;
    }

    setLoading(true);
    return api
      .get(`/incidents?page=${page}`)
      .then(res => {
        setIncidents([...incidents, ...res.data]);
        setTotal(res.headers["x-total-count"]);
        setPage(page + 1);
        setLoading(false);
      })
      .catch(e =>
        Alert.alert(
          "Ops!",
          "Ocorreu um erro ao buscar os dados, tente novamente mais tarde!"
        )
      );
  }

  useEffect(() => {
    loadIncidents();
  }, [page]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem Vindo(a)!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo e salve o dia!
      </Text>
      {incidents.length > 0 ? (
        <FlatList
          style={styles.incidentList}
          data={incidents}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          onEndReached={loadIncidents}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <View style={styles.incident}>
              <Text style={styles.incidentProperty}>ONG:</Text>
              <Text style={styles.incidentValue}>{item.name}</Text>

              <Text style={styles.incidentProperty}>CASO:</Text>
              <Text style={styles.incidentValue}>{item.description}</Text>

              <Text style={styles.incidentProperty}>VALOR:</Text>
              <Text style={styles.incidentValue}>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(item.value)}
              </Text>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigateToDetail(item)}
              >
                <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                <Feather name="arrow-right" size={16} color="#e02041" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 24 }}>
          No momento nenhum incidente foi encontrado. :)
        </Text>
      )}
    </View>
  );
}
