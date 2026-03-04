import AsyncStorage from "@react-native-async-storage/async-storage"; // Importação do AsyncStorage para armazenamento local
import { Orcamento } from "../types"; // Importação do tipo Orcamento para tipagem dos itens armazenados

const KEY = "@orcamentos:itens"; // Chave utilizada para armazenar os itens no AsyncStorage, garantindo que os dados sejam organizados e acessíveis

export async function getItens(): Promise<Orcamento[]> {
  // Usada para obter os itens armazenados (retorna uma lista de orçamentos)
  try {
    const jsonValue = await AsyncStorage.getItem(KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Erro ao obter itens:", error);
    return [];
  }
}

export async function saveItens(itens: Orcamento[]): Promise<void> {
  // Usada para salvar a lista de itens no AsyncStorage (recebe uma lista de orçamentos e a armazena)
  try {
    const jsonValue = JSON.stringify(itens);
    await AsyncStorage.setItem(KEY, jsonValue);
  } catch (error) {
    console.error("Erro ao salvar itens:", error);
    throw error;
  }
}

export async function addItem(newItem: Orcamento): Promise<void> {
  // Usada para adicionar um novo item à lista de itens armazenados (recebe um orçamento e o adiciona à lista existente, garantindo que não haja duplicatas)
  try {
    const itens = await getItens();

    // Validação: verifica se item já existe
    if (itens.some((item) => item.id === newItem.id)) {
      throw new Error(`Item com ID ${newItem.id} já existe`);
    }

    itens.push(newItem);
    await saveItens(itens);
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    throw error;
  }
}

export async function updateItem( // Usada para atualizar um item existente na lista de itens armazenados (recebe o ID do item a ser atualizado e os dados atualizados, garantindo que o item exista antes de tentar atualizar)
  id: string,
  updatedData: Partial<Orcamento>,
): Promise<void> {
  try {
    const itens = await getItens();
    const index = itens.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item com ID ${id} não encontrado`);
    }

    itens[index] = { ...itens[index], ...updatedData };
    await saveItens(itens);
  } catch (error) {
    console.error("Erro ao atualizar item:", error);
    throw error;
  }
}

export async function removeItem(id: string): Promise<void> {
  // Usada para remover um item da lista de itens armazenados (recebe o ID do item a ser removido, garantindo que o item exista antes de tentar remover)
  try {
    const itens = await getItens();
    const itemExiste = itens.some((item) => item.id === id);

    if (!itemExiste) {
      throw new Error(`Item com ID ${id} não encontrado`);
    }

    const filtered = itens.filter((item) => item.id !== id);
    await saveItens(filtered);
  } catch (error) {
    console.error("Erro ao remover item:", error);
    throw error;
  }
}

export async function clearAllItens(): Promise<void> {
  // Usada para limpar todos os itens do AsyncStorage
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error("Erro ao limpar itens:", error);
    throw error;
  }
}
