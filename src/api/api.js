import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class PuphubApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${PuphubApi.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Add a dog */

  static async addDog(data, username) {
    let res = await this.request(`dogs/${username}`, data, "post");
    return res.token;
  }

  /* Get a users dogs (filtered by username) */
  /* ASK JULIE ABOUT THIS */

  static async getUsersDogs(username) {
    let res = await this.request(`dogs/user/${username}`);
    return res.dogs;
  }

  /** Get dogs (filtered by name if not undefined) */

  static async getDogs(name) {
    let res = await this.request("dogs", { name });
    return res.dogs;
  }

  /** Get details on a dog by id. */

  static async getDog(id) {
    let res = await this.request(`dogs/${id}`);
    // let res = await this.request("dogs", { id });

    console.log(JSON.stringify(res));
    return res.dog;
  }

  /** Delete a dog by its ID */
  // static async deleteDog(id) {
  //   try {
  //     await this.request(`dogs/${id}`, {}, "delete");
  //     console.log(`(API) Deleting this dog with id: ${id}`)
  //   } catch (err) {
  //     console.error("Error deleting dog:", err.response);
  //     throw err.response.data.error.message;
  //   }
  // }

  static async deleteDog(id) {
    try {
      await this.request(`dogs/${id}`, {}, "delete");
      console.log(`(API) Deleting this dog with id: ${id}`);
    } catch (err) {
      // Check if err.response exists before accessing its properties
      if (err.response && err.response.data && err.response.data.error) {
        console.error("Error deleting dog:", err.response.data.error.message);
        throw err.response.data.error.message;
      } else {
        // If the error response is not as expected, throw a generic error
        console.error("Error deleting dog:", err);
        throw "An error occurred while deleting the dog.";
      }
    }
  }

  static async deleteBooking(id) {
    try {
      await this.request(`bookings/${id}`, {}, "delete");
      console.log(`(API) Deleting this booking with id: ${id}`);
    } catch (err) {
      // Check if err.response exists before accessing its properties
      if (err.response && err.response.data && err.response.data.error) {
        console.error("Error deleting booking:", err.response.data.error.message);
        throw err.response.data.error.message;
      } else {
        // If the error response is not as expected, throw a generic error
        console.error("Error deleting booking:", err);
        throw "An error occurred while deleting the booking.";
      }
    }
  }
  /** Get list of bookings (filtered by date if not undefined) */

  static async getBookings(username) {
    let res = await this.request(`bookings/${username}`);
    return res.bookings;
  }

  /** Add booking */

  static async addBooking(data, username) {
    let res = await this.request(`bookings/${username}`, data, "post");
    return res.booking;
  }


  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}


export default PuphubApi;
