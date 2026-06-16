import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error(`HTTP Error! status = ${error.response.status}`);
    }
    console.error(error.message);
  }
};

const createPost = async () => {
  console.log("============== Create Post ==============");
  try {
    const dataPost = {
      title: "Belajar Axios",
      body: "Kucing lu",
      userId: 30,
    };
    const response = await axios.post(`${API_URL}`, dataPost);
    const data = response.data;
    console.log(data);
  } catch (error) {
    if (error.response) {
      console.error(`HTTP Error! status = ${error.response}`);
    }
    console.error(error.message);
  }
};

const updatePostById = async (id) => {
  console.log("============ Update Post By Id =============");
  const dataUpdate = {
    title: "Coba update",
  };
  try {
    const response = await axios.patch(`${API_URL}/${id}`, dataUpdate);
    const data = await response.data;
    console.log(`Berhasil update dengan data`, data);
  } catch (error) {
    if (error.response) {
      console.error(error.response);
    }
    console.error(error);
  }
};

const deletePostById = async (id) => {
  console.log("=========== Delete By Id ===========");
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    const data = await response.data;
    console.log("Berhasil Delete dengan data = ", data);
  } catch (error) {
    if (error.response) {
      console.error(`HTTP Error! dengan status = ${error.response}`);
    }
    console.error(error.message);
  }
};
const hasil = async () => {
  await getPostById(1);
  await createPost();
  await updatePostById(1);
  await deletePostById(1);
};
hasil();
