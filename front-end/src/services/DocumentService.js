import {fetchWithAuth, handleApiError} from "../utils/FetchWithAuth";

const fakeDocuments = [
  {
    id: 1,
    name: 'Hợp đồng lao động.pdf',
    createdAt: '2023-12-01',
  },
  {
    id: 2,
    name: 'Bảng lương tháng 5.xlsx',
    createdAt: '2024-05-31',
  },
  {
    id: 3,
    name: 'Giấy khen.jpg',
    createdAt: '2024-04-15',
  },
];

const DocumentService = {
    async getDocumentsByEmployee(employeeId) {
        // Trả về fake data
        return Promise.resolve({ data: fakeDocuments });
    },
    async uploadDocument(employeeId, formData) {
        // Giả lập upload thành công
        return Promise.resolve({ message: 'Upload thành công' });
    },
    async updateDocument(documentId, formData) {
        // Giả lập update thành công
        return Promise.resolve({ message: 'Update thành công' });
    },
    async deleteDocument(documentId) {
        // Giả lập xóa thành công
        return Promise.resolve({ message: 'Delete thành công' });
    },
};

export default DocumentService; 
