FROM node:18-alpine

ENV SHOPIFY_API_KEY="b59bd07eca89b42995de6af80ed18ee8" \
    SHOPIFY_API_SECRET="33539136459dba5de4e9baa73c96a6d9" \
    SCOPES="write_products,read_products,read_all_orders,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory" \
    HOST="https://localhost:4200" \
    PORT=8081
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]