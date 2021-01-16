
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    'Content-Type': 'application/json'
});

export const GetToDos = async () => {
    const authToken = localStorage.getItem('AuthToken');
    API.defaults.headers.common = { Authorization: authToken };
    const response = await API
        .get('/todos')
        .then((response) => {
            if (response.status === 200 && response.data.status) return response.data
        })
        .catch((err) => {
            console.log(err);
        });
    return response
}

export const AddBasketFunc = async (data) => {
    const authToken = localStorage.getItem('AuthToken');
    API.defaults.headers.common = { Authorization: authToken };
    const response = await API
        .post('/add-basket', data)
        .then((response) => {
            console.log(response)
            if (response.status === 201 && response.data) return response.data
        })
        .catch((err) => {
            console.log(err);
        });
    return response
}


export const AddTodos = async (data) => {
    const authToken = localStorage.getItem('AuthToken');
    API.defaults.headers.common = { Authorization: authToken };
    const response = await API
        .post('/todos', data)
        .then((response) => {
            console.log()
            if (response.status === 201 && response.data) return response.data
        })
        .catch((err) => {
            console.log(err);
        });
    return response
}

export const EditTodos = async (data) => {
    const authToken = localStorage.getItem('AuthToken');
    API.defaults.headers.common = { Authorization: authToken };
    const response = await API
        .put('/todos', data)
        .then((response) => {
            if (response.status === 200 && response.data) return response.data
        })
        .catch((err) => {
            console.log(err);
        });
    return response
}

export const DeleteTodo = async (data) => {
    console.log(data)
    const authToken = localStorage.getItem('AuthToken');
    API.defaults.headers.common = { Authorization: authToken };
    const response = await API
        .delete('/todos', { data: data })
        .then((response) => {
            console.log(response)
            if (response.status === 200 && response.data) return response.data
        })
        .catch((err) => {
            console.log(err);
        });
    return response
}
