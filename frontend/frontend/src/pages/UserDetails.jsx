import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserDetails() {

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  // ================= GET USER =================

  const getUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.get(
        "http://localhost:9000/api/auth/user",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);

    } catch (error) {
      console.log(error);

      localStorage.removeItem("token");
      navigate("/login");
    }
  };


  useEffect(() => {
    getUser();
  }, []);


  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };


  // ================= UPDATE USER =================

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const data = new FormData();

      data.append("firstName", user.firstName);
      data.append("lastName", user.lastName);
      data.append("email", user.email);
      data.append("age", user.age);
      data.append("gender", user.gender);

      // New image selected?
      if (user.newImage) {
        data.append("image", user.newImage);
      }

      const response = await axios.put(
        "http://localhost:9000/api/auth/user",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);

      setEditMode(false);

      toast.success("User updated successfully");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };


  // ================= DELETE USER =================

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        "http://localhost:9000/api/auth/user",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("User deleted successfully");

      localStorage.removeItem("token");

      navigate("/login");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };


  // ================= LOADING =================

  if (!user) {
    return <h2>Loading...</h2>;
  }


  return (
    <div className="table-container">

      <h1>User Details</h1>

      <table>

        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>


        <tbody>

          <tr>

            {/* FIRST NAME */}

            <td>
              {editMode ? (
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                />
              ) : (
                user.firstName
              )}
            </td>


            {/* LAST NAME */}

            <td>
              {editMode ? (
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                />
              ) : (
                user.lastName
              )}
            </td>


            {/* EMAIL */}

            <td>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              ) : (
                user.email
              )}
            </td>


            {/* AGE */}

            <td>
              {editMode ? (
                <input
                  type="number"
                  name="age"
                  value={user.age}
                  onChange={handleChange}
                />
              ) : (
                user.age
              )}
            </td>


            {/* GENDER */}

            <td>
              {editMode ? (
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                user.gender
              )}
            </td>


            {/* IMAGE */}

            <td>

              {editMode ? (
                <>
                  <img
                    src={`http://localhost:9000/uploads/${user.image}`}
                    alt="profile"
                    width="80"
                  />

                  <br />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        newImage: e.target.files[0]
                      });
                    }}
                  />
                </>
              ) : (
                user.image && (
                  <img
                    src={`http://localhost:9000/uploads/${user.image}`}
                    alt="profile"
                    width="80"
                  />
                )
              )}

            </td>


            {/* ACTION */}

            <td>

              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/change-password")}
                  >
                    Change Password
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login-history")}
                  >
                    Login History
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      getUser();
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}

            </td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default UserDetails;