import "core-js/stable";
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockedSocket from "socket.io-mock";

import init from "../src/init.js";

const server = setupServer();
let socket; // eslint-disable-line

const mockInitialData = (_req, res, ctx) => {
  const data = {
    channels: [
      { id: 1, name: "General" },
      { id: 2, name: "Random" },
    ],
    messages: [],
    currentChannelId: 1,
  };

  return res(ctx.status(200), ctx.json(data));
};

const mockSignup = (_req, res, ctx) =>
  res(ctx.status(200), ctx.json({ token: "token", username: "user" }));

const mockSingin = (_req, res, ctx) =>
  res(ctx.status(201), ctx.json({ token: "token", username: "user" }));

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  socket = new MockedSocket();

  socket.on("newMessage", (message, ack) => {
    socket.emit("newMessage", { ...message, id: 1 });
    ack({ status: "ok" });
  });

  socket.on("newChannel", (channel, ack) => {
    const data = { ...channel, id: 3, removable: true };
    socket.emit("newChannel", data);
    ack({ status: "ok", data });
  });

  socket.on("renameChannel", (channel, ack) => {
    socket.emit("renameChannel", { ...channel, removable: true });
    ack({ status: "ok" });
  });

  socket.on("removeChannel", (channel, ack) => {
    socket.emit("removeChannel", { ...channel, removable: true });
    ack({ status: "ok" });
  });

  global.localStorage.clear();
  socket.socketClient.volatile = {
    emit: socket.socketClient.emit.bind(socket.socketClient),
  };
  const vdom = await init(socket.socketClient);
  render(vdom);
  userEvent.click(await screen.findByText(/Hexlet Chat/i));
});

afterEach(() => {
  server.resetHandlers();
});

describe("auth", () => {
  test("login page on enter as guest", async () => {
    expect(window.location.pathname).toBe("/login");
    expect(await screen.findByLabelText(/Ваш ник/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  test("handle login error", async () => {
    server.use(
      rest.post("/api/v1/login", (_req, res, ctx) => res(ctx.status(401)))
    );
    expect(
      screen.queryByText(/Неверные имя пользователя или пароль/i)
    ).not.toBeInTheDocument();
    userEvent.type(await screen.findByLabelText(/Ваш ник/i), "guest");
    userEvent.type(await screen.findByLabelText(/Пароль/i), "pass");
    userEvent.click(await screen.findByRole("button", { name: /Войти/i }));

    expect(
      await screen.findByText(/Неверные имя пользователя или пароль/i)
    ).toBeInTheDocument();
  });

  test("successful login", async () => {
    server.use(
      rest.post("/api/v1/login", mockSingin),
      rest.get("/api/v1/data", mockInitialData)
    );

    userEvent.type(await screen.findByLabelText(/Ваш ник/i), "user");
    userEvent.type(await screen.findByLabelText(/Пароль/i), "pass");
    userEvent.click(await screen.findByRole("button", { name: /Войти/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});
