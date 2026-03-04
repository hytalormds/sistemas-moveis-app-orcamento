import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#6a4eff" },
  subtitle: { color: "#666", marginTop: 4 },
  botaoNovo: {
    backgroundColor: "#6a4eff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  botaoNovoTexto: { color: "white", fontWeight: "bold", fontSize: 16 },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
  },
  buscaInput: {
    flex: 1,
    fontSize: 16,
  },
  filtroBotao: {
    marginLeft: 8,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "auto",
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#000",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#6a4eff",
  },
  statusButtonInactive: {
    backgroundColor: "#f0f0f0",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  statusButtonTextInactive: {
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#6a4eff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 50,
  },
  filterButtonText: {
    fontSize: 20,
    color: "#6a4eff",
  },
});
