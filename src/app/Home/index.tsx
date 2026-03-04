import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { X } from "lucide-react-native";

import {
  getItens,
  addItem,
  removeItem,
  updateItem,
} from "../../storage/itemStorage";
import { Orcamento, StatusOrcamento } from "../../types";
import { OrcamentoCard } from "../../components/OrcamentoCard";

import { styles } from "./styles";

const STATUS_OPCOES: StatusOrcamento[] = [
  "Rascunho",
  "Enviado",
  "Aprovado",
  "Recusado",
];

export default function Home() {
  const [busca, setBusca] = useState("");
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [mostraModal, setMostraModal] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoCliente, setNovoCliente] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoStatus, setNovoStatus] = useState<StatusOrcamento>("Rascunho");
  const [orcamentoEmEdicao, setOrcamentoEmEdicao] = useState<Orcamento | null>(
    null,
  );

  // Carrega os dados ao inicializar o componente
  useEffect(() => {
    carregarOrcamentos();
  }, []);

  async function carregarOrcamentos() {
    try {
      setEstaCarregando(true);
      const dados = await getItens();
      setOrcamentos(dados);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      setOrcamentos([]);
    } finally {
      setEstaCarregando(false);
    }
  }

  async function criarNovoOrcamento() {
    if (!novoTitulo.trim() || !novoCliente.trim() || !novoValor.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      const valor = parseFloat(novoValor);
      if (isNaN(valor) || valor <= 0) {
        Alert.alert("Erro", "O valor deve ser um número positivo");
        return;
      }

      if (orcamentoEmEdicao) {
        // Modo de edição
        await updateItem(orcamentoEmEdicao.id, {
          titulo: novoTitulo.trim(),
          cliente: novoCliente.trim(),
          status: novoStatus,
          valorTotal: valor,
        });
        setOrcamentos(
          orcamentos.map((o) =>
            o.id === orcamentoEmEdicao.id
              ? {
                  ...o,
                  titulo: novoTitulo.trim(),
                  cliente: novoCliente.trim(),
                  status: novoStatus,
                  valorTotal: valor,
                }
              : o,
          ),
        );
        Alert.alert("Sucesso", "Orçamento atualizado com sucesso!");
      } else {
        // Modo de criação
        const novoOrcamento: Orcamento = {
          id: Date.now().toString(),
          titulo: novoTitulo.trim(),
          cliente: novoCliente.trim(),
          status: novoStatus,
          valorTotal: valor,
        };

        await addItem(novoOrcamento);
        setOrcamentos([...orcamentos, novoOrcamento]);
        Alert.alert("Sucesso", "Orçamento criado com sucesso!");
      }

      // Limpar formulário e fechar modal
      setMostraModal(false);
      setNovoTitulo("");
      setNovoCliente("");
      setNovoValor("");
      setNovoStatus("Rascunho");
      setOrcamentoEmEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      Alert.alert("Erro", "Não foi possível salvar o orçamento");
    }
  }

  async function deletarOrcamento(id: string) {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja deletar este orçamento?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await removeItem(id);
              setOrcamentos(orcamentos.filter((o) => o.id !== id));
              Alert.alert("Sucesso", "Orçamento deletado com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar orçamento:", error);
              Alert.alert("Erro", "Não foi possível deletar o orçamento");
            }
          },
          style: "destructive",
        },
      ],
    );
  }

  function abrirEdicao(orcamento: Orcamento) {
    setOrcamentoEmEdicao(orcamento);
    setNovoTitulo(orcamento.titulo);
    setNovoCliente(orcamento.cliente);
    setNovoValor(orcamento.valorTotal.toString());
    setNovoStatus(orcamento.status);
    setMostraModal(true);
  }

  function fecharModal() {
    setMostraModal(false);
    setNovoTitulo("");
    setNovoCliente("");
    setNovoValor("");
    setNovoStatus("Rascunho");
    setOrcamentoEmEdicao(null);
  }

  const orcamentosFiltrados = busca.trim()
    ? orcamentos.filter(
        (o) =>
          o.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          o.cliente.toLowerCase().includes(busca.toLowerCase()),
      )
    : orcamentos;

  const rascunhosCount = orcamentos.filter(
    (o) => o.status === "Rascunho",
  ).length;

  return (
    <View style={styles.container}>
      {estaCarregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a4eff" />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Orçamentos</Text>
              <Text style={styles.subtitle}>
                Você tem {rascunhosCount} item{rascunhosCount !== 1 ? "s" : ""}{" "}
                em rascunho
              </Text>
            </View>
            <TouchableOpacity
              style={styles.botaoNovo}
              onPress={() => setMostraModal(true)}
            >
              <Text style={styles.botaoNovoTexto}>+ Novo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buscaContainer}>
            <TextInput
              style={styles.buscaInput}
              placeholder="Título ou cliente"
              value={busca}
              onChangeText={setBusca}
              clearButtonMode="while-editing"
            />
            <TouchableOpacity style={styles.filtroBotao}>
              <Text style={styles.filterButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={orcamentosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OrcamentoCard
                orcamento={item}
                onEdit={() => abrirEdicao(item)}
                onDelete={() => deletarOrcamento(item.id)}
              />
            )}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Modal para criar/editar orçamento */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={mostraModal}
            onRequestClose={fecharModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {orcamentoEmEdicao ? "Editar Orçamento" : "Novo Orçamento"}
                  </Text>
                  <TouchableOpacity onPress={fecharModal}>
                    <X color="#000" size={24} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Título do orçamento"
                  value={novoTitulo}
                  onChangeText={setNovoTitulo}
                  placeholderTextColor="#999"
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Nome do cliente"
                  value={novoCliente}
                  onChangeText={setNovoCliente}
                  placeholderTextColor="#999"
                />

                <TextInput
                  style={styles.modalInput}
                  placeholder="Valor (ex: 1000,00)"
                  value={novoValor}
                  onChangeText={setNovoValor}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />

                <Text style={styles.statusLabel}>Status</Text>
                <View style={styles.statusContainer}>
                  {STATUS_OPCOES.map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setNovoStatus(status)}
                      style={[
                        styles.statusButton,
                        novoStatus === status
                          ? styles.statusButtonActive
                          : styles.statusButtonInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          novoStatus === status
                            ? styles.statusButtonTextActive
                            : styles.statusButtonTextInactive,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={criarNovoOrcamento}
                >
                  <Text style={styles.submitButtonText}>
                    {orcamentoEmEdicao
                      ? "Atualizar Orçamento"
                      : "Criar Orçamento"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
