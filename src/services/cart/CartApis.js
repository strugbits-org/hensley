"use server";
import { AddProductToCartVisitor, getProductsCartVisitor, removeProductFromCartVisitor, updateProductsQuantityCartVisitor, updateProductInCartVisitor } from "./CartApisVisitor";
import { getAuthToken, getCartId, clearAuthSession } from "../auth";
import { logError } from "@/utils";

const baseUrl = process.env.BASE_URL;

export const getProductsCart = async (retries = 3, delay = 1000) => {
  const retryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const authToken = await getAuthToken();

      if (!authToken) {
        const cartId = await getCartId();
        const response = await getProductsCartVisitor(cartId);
        return response;
      }

      const response = await fetch(`${baseUrl}/api/cart/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({}),
        cache: "no-store",
      });

      // The stored token is no longer valid against the current backend (e.g.
      // it was issued by a previous environment). Drop the dead session and
      // serve the guest cart so the user isn't stuck.
      if (response.status === 401) {
        await clearAuthSession();
        const cartId = await getCartId();
        return await getProductsCartVisitor(cartId);
      }

      const data = await response.json();
      if (!data.cart) throw new Error(data.error);

      return data.cart;

    } catch (error) {
      logError(`Error fetching cart: Attempt ${attempt} failed: ${error}`);
      if (error.message === "Token has expired") {
        return "Token has expired";
      }

      if (attempt < retries) {
        logError(`Retrying in ${delay}ms...`);
        await retryDelay(delay);
        delay *= 2;
      } else {
        logError(`Attempt ${attempt} failed. No more retries left.`);
        return [];
      }
    }
  }
};

export const AddProductToCart = async (productData) => {
  try {
    const authToken = await getAuthToken();

    if (!authToken) {
      const cartId = await getCartId();
      const response = AddProductToCartVisitor(cartId, productData);
      return response;
    }

    const payload = { productData };

    const response = await fetch(`${baseUrl}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      await clearAuthSession();
      const cartId = await getCartId();
      return await AddProductToCartVisitor(cartId, productData);
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductsQuantityCart = async (lineItems) => {
  try {
    const authToken = await getAuthToken();

    if (!authToken) {
      const cartId = await getCartId();
      const response = updateProductsQuantityCartVisitor(cartId, lineItems);
      return response;
    }

    const payload = { lineItems };

    const response = await fetch(`${baseUrl}/api/cart/updateQuantity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      await clearAuthSession();
      const cartId = await getCartId();
      return await updateProductsQuantityCartVisitor(cartId, lineItems);
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeProductFromCart = async (lineItemIds) => {
  try {
    const authToken = await getAuthToken();

    if (!authToken) {
      const cartId = await getCartId();
      const response = removeProductFromCartVisitor(cartId, lineItemIds);
      return response;
    }

    const payload = { lineItemIds };

    const response = await fetch(`${baseUrl}/api/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      await clearAuthSession();
      const cartId = await getCartId();
      return await removeProductFromCartVisitor(cartId, lineItemIds);
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductInCart = async (id, productData) => {
  try {
    const authToken = await getAuthToken();

    if (!authToken) {
      const cartId = await getCartId();
      const response = updateProductInCartVisitor(cartId, id, productData);
      return response;
    }

    const payload = { id, productData };

    const response = await fetch(`${baseUrl}/api/cart/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      await clearAuthSession();
      const cartId = await getCartId();
      return await updateProductInCartVisitor(cartId, id, productData);
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};