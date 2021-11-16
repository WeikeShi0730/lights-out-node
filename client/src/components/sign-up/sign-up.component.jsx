import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "../../assets/country-list.json";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import UserService from "../../services/user-service";
import { toast } from "react-toastify";
import { setCurrentUser } from "../../redux/actions/user.action";

const SignUp = ({ setCurrentUser }) => {
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList, []);
  const history = useHistory();
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    country: "",
    password: "",
  });
  const handleCountryChange = (value) => {
    const code = value.value;
    setValue(value);
    setSignUpInfo({
      ...signUpInfo,
      country: code,
    });
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setSignUpInfo({
      ...signUpInfo,
      [name]: value,
    });
  };
  const handleSignUpFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await UserService.signUp(signUpInfo);
      const currentUser = res.data;
      setCurrentUser(currentUser);
      history.push("/");
      toast.success("success ✅", {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark",
      });
      console.error(error.response.data.message);
    }
  };
  return (
    <React.Fragment>
      <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg m-auto mt-10 bg-white rounded-lg border border-primaryBorder shadow-default py-8 px-10">
        <h1 className="text-base lg:text-lg font-medium text-primary mt-4 mb-12 text-center">
          sign up 🔐
        </h1>

        <form onSubmit={handleSignUpFormSubmit}>
          <div>
            <label className="text-sm md:text-base">username</label>
            <input
              required
              name="name"
              type="text"
              className="text-xs md:text-md w-full p-2 text-primary border rounded-md outline-none transition duration-150 ease-in-out mb-4"
              id="name"
              placeholder="your username"
              onChange={handleChange}
              maxLength="10"
            />
          </div>
          <div>
            <label className="text-sm md:text-base">country</label>
            <Select
              required
              name="country"
              id="country"
              options={options}
              value={value}
              className="text-xs md:text-md w-full text-primary outline-none transition duration-150 ease-in-out mb-4"
              onChange={handleCountryChange}
            />
          </div>
          <div>
            <label className="text-sm md:text-base">password</label>
            <input
              required
              name="password"
              type="password"
              className="text-xs md:text-md w-full p-2 text-primary border rounded-md outline-none transition duration-150 ease-in-out mb-4"
              id="password"
              placeholder="your password"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-center items-center mt-6">
            <button className="text-xs md:text-sm bg-gray-800 py-2 px-4 text-white rounded border focus:outline-none">
              sign up
            </button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-md m-auto mt-4">
        <div className="text-base lg:text-lg flex justify-center items-center">
          already have an account?
        </div>
        <div>
          <Link to="/sign-in">
            <div className="flex justify-center items-center mt-6">
              <button className="text-xs md:text-sm bg-gray-800 py-2 px-4 text-white rounded border focus:outline-none">
                sign in
              </button>
            </div>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
// });

export default connect(null, { setCurrentUser })(SignUp);
