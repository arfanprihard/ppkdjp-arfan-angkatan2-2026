const API_URL = "https://jsonplaceholder.typicode.com/users";

const getAllUsers = async () => {
  console.log("==============Get All Users==============");
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! status = ${response.status}`);
    }
    const data = await response.json();
    console.log("Hasil data user: ", data);
  } catch (error) {
    console.error(`Terjadi Kesalahan = ${error}`);
  }
};

const getAllUserById = async (id) => {
  console.log("=========== GET USER BY ID ================");
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error = ${response.status}`);
    }
    const data = await response.json();
    console.log(`Data User`, data);
  } catch (error) {
    console.error(`Terjadi Kesalahan = ${error}`);
  }
};

const updateUserById = async (id) => {
  console.log("=========== UPDATE USER BY ID ================");
  try {
    const dataUpdate = {
      name: "Arf",
      username: "ari",
    };
    const response = await fetch(API_URL + `/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUpdate),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! status = ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(`Terjadi kesalahan = ${error}`);
  }
};

const deleteUserById = async (id) => {
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! Status = ${response.status}`);
    }
    const data = await response.json();
    console.log(`User dengan id ${id} berhasil dihapus`);
  } catch (error) {
    console.error(`Terjadi kesalahan saat delete, error = ${error}`);
  }
};

const hasil = async () => {
  await getAllUsers();
  await getAllUserById(1);
  await updateUserById(1);
  await deleteUserById(1);
};
hasil();
