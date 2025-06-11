"use client";
import React, { use, useCallback, useEffect, useState } from 'react'
import { CartCollection, CartNormal, CartTent } from './CartItems'
import PriceDisplay from './PriceDisplay'
import { AddToQuote } from './AddtoQuoteButton'
import { CustomLink } from '../common/CustomLink'
import { getProductsCart, removeProductFromCart, updateProductsQuantityCart } from '@/services/cart/CartApis';
import { calculateTotalCartQuantity, formatDescriptionLines, formatTotalPrice, logError } from '@/utils';
import { useCookies } from 'react-cookie';
import { debounce } from 'lodash';
import { lightboxActions } from '@/store/lightboxStore';
import { loaderActions } from '@/store/loaderStore';

const QUANTITY_LIMITS = { MIN: 1, MAX: 10000 };

const Cart = () => {
  const [_cookies, setCookie] = useCookies(["cartQuantity"]);
  const [cartItems, setCartItems] = useState([]);
  const [trashList, setTrashList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartItems = async () => {
    try {
      // const response = await getProductsCart();
      const response = {
        "lineItems": [
          {
            "quantity": 1,
            "catalogReference": {
              "catalogItemId": "fbdf7f43-8c31-40ec-8d46-e58e83cb9cf5",
              "appId": "215238eb-22a5-4c36-9e7b-e7c08025e04e",
              "options": {
                "customTextFields": {
                  "Set": "MENDOCINO LATTE - CHARGER~—~3.25~10; MENDOCINO LATTE - DINNER PLATE~—~2.15~10; MENDOCINO LATTE - SALAD PLATE~—~2.15~10; MENDOCINO LATTE - BREAD & BUTTER PLATE~—~2.15~10"
                }
              }
            },
            "productName": {
              "original": "MENDOCINO LATTE - COLLECTION",
              "translated": "MENDOCINO LATTE - COLLECTION"
            },
            "url": "https://www.hensleyeventresources.com/product-page/mendocino-latte",
            "price": {
              "amount": "2.15",
              "convertedAmount": "2.15",
              "formattedAmount": "$2.15",
              "formattedConvertedAmount": "$2.15"
            },
            "originalPrice": "2.15",
            "originalFullPrice": "2.15",
            "fullPrice": {
              "amount": "2.15",
              "convertedAmount": "2.15",
              "formattedAmount": "$2.15",
              "formattedConvertedAmount": "$2.15"
            },
            "priceBeforeDiscounts": {
              "amount": "2.15",
              "convertedAmount": "2.15",
              "formattedAmount": "$2.15",
              "formattedConvertedAmount": "$2.15"
            },
            "lineItemPrice": {
              "amount": "2.15",
              "convertedAmount": "2.15",
              "formattedAmount": "$2.15",
              "formattedConvertedAmount": "$2.15"
            },
            "descriptionLines": [
              {
                "name": {
                  "original": "Set",
                  "translated": "Set"
                },
                "plainText": {
                  "original": "MENDOCINO LATTE - CHARGER~—~3.25~10; MENDOCINO LATTE - DINNER PLATE~—~2.15~10; MENDOCINO LATTE - SALAD PLATE~—~2.15~10; MENDOCINO LATTE - BREAD & BUTTER PLATE~—~2.15~10",
                  "translated": "MENDOCINO LATTE - CHARGER~—~3.25~10; MENDOCINO LATTE - DINNER PLATE~—~2.15~10; MENDOCINO LATTE - SALAD PLATE~—~2.15~10; MENDOCINO LATTE - BREAD & BUTTER PLATE~—~2.15~10"
                },
                "lineType": "UNRECOGNISED",
                "modifierDescriptionLine": false
              }
            ],
            "image": "wix:image://v1/339f77_90eea5aab97d40289767596970d91ed0~mv2.jpg/339f77_90eea5aab97d40289767596970d91ed0~mv2.jpg#originWidth=1785&originHeight=2677",
            "availability": {
              "status": "AVAILABLE"
            },
            "physicalProperties": {
              "sku": "",
              "shippable": true
            },
            "couponScopes": [
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "5e833fa8-7a58-481b-9c41-76f0e0e1e964"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "c1f6f58a-a107-e2f8-ea94-4998386cc76f"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "80318732-dfa7-93e3-7f90-b9b9b655a203"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "42a9a50c-5e9f-6d34-0162-7b8671984533"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "00000000-000000-000000-000000000001"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "product",
                  "entityId": "fbdf7f43-8c31-40ec-8d46-e58e83cb9cf5"
                }
              }
            ],
            "itemType": {
              "preset": "PHYSICAL"
            },
            "paymentOption": "FULL_PAYMENT_ONLINE",
            "rootCatalogItemId": "fbdf7f43-8c31-40ec-8d46-e58e83cb9cf5",
            "customLineItem": false,
            "priceUndetermined": false,
            "fixedQuantity": false,
            "savePaymentMethod": false,
            "policies": [],
            "inventoryAppId": "215238eb-22a5-4c36-9e7b-e7c08025e04e",
            "membersOnly": false,
            "modifierGroups": [],
            "modifiersTotalPrice": {
              "amount": "0",
              "convertedAmount": "0",
              "formattedAmount": "$0.00",
              "formattedConvertedAmount": "$0.00"
            },
            "_id": "00000000-0000-0000-0000-000000000001"
          },
          {
            "quantity": 1,
            "catalogReference": {
              "catalogItemId": "b0d196cb-6001-416a-a288-026283eb9d80",
              "appId": "215238eb-22a5-4c36-9e7b-e7c08025e04e",
              "options": {
                "customTextFields": {
                  "size": "—"
                }
              }
            },
            "productName": {
              "original": "MARIE DAAGE CHARGER - BAMBOO SLATE (Luxury Collection)",
              "translated": "MARIE DAAGE CHARGER - BAMBOO SLATE (Luxury Collection)"
            },
            "url": "https://www.hensleyeventresources.com/product-page/marie-daage-charger-bamboo-slate-luxury-collection",
            "price": {
              "amount": "17.95",
              "convertedAmount": "17.95",
              "formattedAmount": "$17.95",
              "formattedConvertedAmount": "$17.95"
            },
            "originalPrice": "17.95",
            "originalFullPrice": "17.95",
            "fullPrice": {
              "amount": "17.95",
              "convertedAmount": "17.95",
              "formattedAmount": "$17.95",
              "formattedConvertedAmount": "$17.95"
            },
            "priceBeforeDiscounts": {
              "amount": "17.95",
              "convertedAmount": "17.95",
              "formattedAmount": "$17.95",
              "formattedConvertedAmount": "$17.95"
            },
            "lineItemPrice": {
              "amount": "17.95",
              "convertedAmount": "17.95",
              "formattedAmount": "$17.95",
              "formattedConvertedAmount": "$17.95"
            },
            "descriptionLines": [
              {
                "name": {
                  "original": "size",
                  "translated": "size"
                },
                "plainText": {
                  "original": "—",
                  "translated": "—"
                },
                "lineType": "UNRECOGNISED",
                "modifierDescriptionLine": false
              }
            ],
            "image": "wix:image://v1/339f77_219d7308b43948a68f462240eda3257b~mv2.jpg/339f77_219d7308b43948a68f462240eda3257b~mv2.jpg#originWidth=1014&originHeight=1521",
            "availability": {
              "status": "AVAILABLE"
            },
            "physicalProperties": {
              "sku": "PLCHARMDBAM",
              "shippable": true
            },
            "couponScopes": [
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "dcbb822e-e1e2-3074-3272-c7aaf5ea0f6f"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "80318732-dfa7-93e3-7f90-b9b9b655a203"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "13195e31-6719-59fc-92d4-b52cbf49f33b"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "f0572833-4a7f-42b8-9c58-7e29b4a97fe0"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "42a9a50c-5e9f-6d34-0162-7b8671984533"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "collection",
                  "entityId": "00000000-000000-000000-000000000001"
                }
              },
              {
                "namespace": "stores",
                "group": {
                  "name": "product",
                  "entityId": "b0d196cb-6001-416a-a288-026283eb9d80"
                }
              }
            ],
            "itemType": {
              "preset": "PHYSICAL"
            },
            "paymentOption": "FULL_PAYMENT_ONLINE",
            "rootCatalogItemId": "b0d196cb-6001-416a-a288-026283eb9d80",
            "customLineItem": false,
            "priceUndetermined": false,
            "fixedQuantity": false,
            "savePaymentMethod": false,
            "policies": [],
            "inventoryAppId": "215238eb-22a5-4c36-9e7b-e7c08025e04e",
            "membersOnly": false,
            "modifierGroups": [],
            "modifiersTotalPrice": {
              "amount": "0",
              "convertedAmount": "0",
              "formattedAmount": "$0.00",
              "formattedConvertedAmount": "$0.00"
            },
            "_id": "00000000-0000-0000-0000-000000000002"
          }
        ],
        "buyerInfo": {
          "contactId": "82f4bc9c-632c-4516-8801-be72e8c33e7c",
          "memberId": "82f4bc9c-632c-4516-8801-be72e8c33e7c"
        },
        "currency": "USD",
        "conversionCurrency": "USD",
        "buyerLanguage": "en",
        "siteLanguage": "en",
        "taxIncludedInPrices": false,
        "weightUnit": "LB",
        "subtotal": {
          "amount": "20.1",
          "convertedAmount": "20.1",
          "formattedAmount": "$20.10",
          "formattedConvertedAmount": "$20.10"
        },
        "subtotalAfterDiscounts": {
          "amount": "20.1",
          "convertedAmount": "20.1",
          "formattedAmount": "$20.10",
          "formattedConvertedAmount": "$20.10"
        },
        "discount": {
          "amount": "0",
          "convertedAmount": "0",
          "formattedAmount": "$0.00",
          "formattedConvertedAmount": "$0.00"
        },
        "appliedDiscounts": [],
        "purchaseFlowId": "faf0cfb1-0f10-4e59-841e-cf3b09cef550",
        "paymentCurrency": "USD",
        "managedByV2": false,
        "_id": "fc0b968f-8938-4d2b-8044-d3bd55feb40c",
        "_createdDate": "2025-06-11T10:40:31.579Z",
        "_updatedDate": "2025-06-11T13:05:26.607Z"
      };
      const lineItems = response?.lineItems || [];
      setCartItems(lineItems);

      const total = calculateTotalCartQuantity(lineItems);
      setCookie("cartQuantity", total > 0 ? String(total) : "0", { path: "/" });

    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
      loaderActions.hide();
      lightboxActions.hideAllLightBoxes();
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = useCallback((value, id, disabled) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (
      isNaN(numValue) ||
      numValue < QUANTITY_LIMITS.MIN ||
      numValue > QUANTITY_LIMITS.MAX
    ) {
      return;
    }

    const updatedLineItems = cartItems.map(item =>
      item._id === id ? { ...item, quantity: numValue } : item
    );

    setCartItems(updatedLineItems);

    if (!disabled) {
      updateProducts(id, numValue, updatedLineItems);
    }
  }, [cartItems]);

  const handleCollectionQuantityChange = useCallback((data, value, id, disabled) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

    if (
      isNaN(numValue) ||
      numValue < QUANTITY_LIMITS.MIN ||
      numValue > QUANTITY_LIMITS.MAX
    ) {
      return;
    }
    const updatedSet = data.productSetItems.map(item => {
      const set = item.split("~");
      if (set[0] === id) {
        return `${set[0]}~${set[1]}~${set[2]}~${numValue}`;
      }
      return item;
    }).join("; ");

    data.catalogReference.options.customTextFields.Set = updatedSet;
    data.descriptionLines = data.descriptionLines.map(line => {
      if (line.name.original === "Set") {
        const plainText = {
          translated: updatedSet,
          original: updatedSet
        };

        return { ...line, plainText };
      }
      return line;
    });

    delete data.productSetItems;
    const updatedLineItems = cartItems.map(item =>
      item._id === data._id ? data : item
    );
    setCartItems(updatedLineItems);
    if (!disabled) {
      updateCollectionProducts(data);
    }
  }, [cartItems]);

  const updateCollectionProducts = useCallback(
    debounce(async (data, id, quantity, updatedLineItems) => {
      console.log("updateProductCollection", data, id, quantity, updatedLineItems);
    }, 5000), []);

  const updateProducts = async (id, quantity, updatedLineItems) => {
    const total = calculateTotalCartQuantity(updatedLineItems || cartItems);
    setCookie("cartQuantity", total, { path: "/" });

    updateProductsQuantity([{ _id: id, quantity }]);
  };

  const updateProductsQuantity = useCallback(
    debounce(async (lineItems) => {
      try {
        await updateProductsQuantityCart(lineItems);
      } catch (error) {
        logError("Error while updating products quantity in cart:", error);
      }
    }, 2000),
    []
  );

  useEffect(() => {
    const total = cartItems.reduce((accumulator, item) => {
      return accumulator + (item.fullPrice.amount * item.quantity);
    }, 0);
    setTotalPrice(formatTotalPrice(total));
  }, [cartItems]);

  const removeProduct = async (ids) => {
    const newCartItems = cartItems.filter((item) => !ids.includes(item._id));
    const total = calculateTotalCartQuantity(newCartItems);
    setCookie("cartQuantity", total, { path: "/" });
    setCartItems(newCartItems);
    setTrashList((prevTrashList) => prevTrashList.concat(ids.filter(id => !prevTrashList.includes(id))));
  };

  useEffect(() => {
    if (!trashList.length) return;
    const removeProductsDelayed = debounce(async () => {
      try {
        await removeProductFromCart(trashList);
        setTrashList([]);
      } catch (error) {
        logError("Error while while removing products from cart:", error);
      }
    }, 1000);

    removeProductsDelayed(trashList);

    return () => removeProductsDelayed.cancel();
  }, [trashList])

  return (
    <>
      <div className='w-full min-h-screen flex lg:flex-row flex-col'>
        <div className='lg:w-[30%] border lg:pl-[24px] py-[36px] lg:pr-[95px]'>
          <PriceDisplay totalPrice={totalPrice} />
        </div>
        <div className='lg:w-[70%] border'>
          <h2 className='text-[90px] lg:block hidden text-secondary-alt font-recklessRegular uppercase pt-[25px] pb-[45px]'>your cart</h2>
          {cartItems.map((item, index) => {
            const descriptionLines = formatDescriptionLines(item.descriptionLines);
            const productCollection = descriptionLines.find(x => x.title === "Set")?.value;
            const isTentItem = false;

            if (productCollection) {
              const productSetItems = productCollection.split("; ");
              const data = { ...item, productSetItems };
              return (
                <CartCollection key={index} data={data} actions={{ handleQuantityChange: (value, id, disabled) => handleCollectionQuantityChange(data, value, id, disabled), removeProduct, updateProducts: (value, id, disabled) => updateCollectionProducts(data, value, id, disabled) }} />
              )
            } else if (isTentItem) {
              return (
                <CartTent key={index} data={item} actions={{ handleQuantityChange, removeProduct, updateProducts }} />
              )
            } else {
              return (
                <CartNormal key={index} data={item} actions={{ handleQuantityChange, removeProduct, updateProducts }} />
              )
            };
          })}
          {!isLoading && cartItems.length === 0 && <>
            <div className='text-center mt-[50px] text-secondary-alt uppercase tracking-widest text-[32px] font-haasRegular'>Your cart is empty</div>
          </>}
        </div>
      </div>
      <CustomLink to={"/quote-request"}>
        <AddToQuote text={"request to quote"} />
      </CustomLink>
    </>
  )
}

export default Cart