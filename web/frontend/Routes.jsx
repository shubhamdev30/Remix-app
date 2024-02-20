import { Routes as ReactRouterRoutes, Route, useNavigate } from "react-router-dom";
import { BlockStack, Box, Banner, Spinner, Grid, InlineStack, LegacyCard, Loading, Page, Text, ProgressBar } from '@shopify/polaris';
import React, { useEffect, useState } from 'react'
import { useAuthenticatedFetch } from './hooks'
import TrackComponent from "./pages/track";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addtag } from "./filterslice";
import NotFound from "./pages/NotFound";



/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.globEager(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
export default function Routes({ pages}) {
  const navt = useNavigate();
  const dispatch = useDispatch();
  const dataobj = useSelector((state) => {
    return state.users;
  })
  const fetch = useAuthenticatedFetch();
  useEffect(() => {
      const fetchData = async () => {
        const queryParameters = new URLSearchParams(window.location.search)
        const charge_id = queryParameters.get("charge_id")
        if (charge_id) {
          await fetch("/api/has-payment-check");
          navt("/")
        }
       await getShop();
      };
      fetchData();
  }, [])
  const getShop = async () => {
    const get_shop = await fetch("/api/get-shop");
    const content = await get_shop.json();
      dispatch(addtag({ ...dataobj, plan: {"shop":content.data,"billing":content.billingdata} }))
  }

  const routes = useRoutes(pages);
  const routeComponents = routes.map(({ path, component: Component }) => {
    if (typeof Component === 'object') {
      console.log(Component)
    }
    return <Route key={path} path={path} element={<Component />} />;
  });
  // const NotFound = routes.find(({ path }) => path === "/notFound").component;

  return (
    <div>
    <ReactRouterRoutes>
      {routeComponents}
      <Route path="*" element={<NotFound/>} />
    </ReactRouterRoutes>
 
   </div>
  );
}

function useRoutes(pages) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace("./pages", "")
        .replace(/\.(t|j)sx?$/, "")
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, "/")
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => route.component);

  return routes;
}
