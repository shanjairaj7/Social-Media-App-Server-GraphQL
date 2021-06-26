const { gql } = require("apollo-server");
const { createTestServer } = require("../testServer");

const userID = "60d6c18d2dc62607ac8a0648";

// user id 60d6c18d2dc62607ac8a0648
describe("Queries", () => {
  test("me", async () => {
    const ME = gql`
      {
        me {
          id
          email
        }
      }
    `;

    const { query } = createTestServer({
      user: {
        id: userID,
      },
      models: {
        User: {
          findOne() {
            return {
              id: userID,
              name: "Shanjai",
              email: "shanjai@gmail.com",
              password: "hashedPassword",
              invited: false,
              role: "MEMBER",
            };
          },
        },
      },
    });

    const result = await query({ query: ME });
    expect(result).toMatchSnapshot();
  });
  test("feed", async () => {
    const FEED = gql`
      {
        feed {
          id
          message
          createdAt
          updatedAt
          creator {
            id
            name
            email
            password
            invited
            role
          }
        }
      }
    `;

    const { query } = createTestServer({
      user: {
        id: userID,
      },
      models: {
        Post: {
          find() {
            return [
              {
                id: "1",
                message: "Test",
                createdAt: "123123947",
                updatedAt: "293647623",
                creator: {
                  id: userID,
                  name: "Shanjai",
                  email: "shanjai@gmail.com",
                  password: null,
                  invited: false,
                  role: "MEMBER",
                },
              },
              {
                id: "2",
                message: "New Message",
                createdAt: "472983748",
                updatedAt: "182637226",
                creator: {
                  id: userID,
                  name: "Shanjai",
                  email: "shanjai@gmail.com",
                  password: null,
                  invited: false,
                  role: "MEMBER",
                },
              },
            ];
          },
        },
      },
    });

    const result = await query({ query: FEED });
    expect(result).toMatchSnapshot();
  });
});
