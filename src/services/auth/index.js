"use server";
import { cookies } from "next/headers";
import { createCart } from "./CartApisVisitor";

export const getAuthToken = async () => {
  const cookieStore = cookies();
  const authToken = cookieStore?.get("authToken");
  return authToken?.value || "";
};

export const getMemberTokens = async () => {
  const cookieStore = cookies();
  const tokens = cookieStore?.get("userTokens");
  if (!tokens) return "";

  try {
    return JSON.parse(tokens.value);
  } catch (error) {
    return "";
  }
};

export const getCartId = async (createNew = true) => {
  const cookieStore = cookies();
  const cartId = cookieStore?.get("cartId");
  if (!cartId && createNew) {
    const cart = await createCart();
    cookieStore.set("cartId", cart._id, { path: "/" })
    return cart._id;
  }

  return cartId?.value || "";
};