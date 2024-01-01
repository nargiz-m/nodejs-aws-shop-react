import React from "react";
import { Order, OrderItem } from "~/models/Order";
import axios from "axios";
import { useParams } from "react-router-dom";
import PaperLayout from "~/components/PaperLayout/PaperLayout";
import Typography from "@mui/material/Typography";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { AvailableProduct } from "~/models/Product";
import ReviewOrder from "~/components/pages/PageCart/components/ReviewOrder";
import { OrderStatus, ORDER_STATUS_FLOW } from "~/constants/order";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Field, Form, Formik, FormikProps } from "formik";
import Grid from "@mui/material/Grid";
import TextField from "~/components/Form/TextField";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import { useQueries } from "react-query";
import { useInvalidateOrder, useUpdateOrderStatus } from "~/queries/orders";

type FormValues = {
  comment: string;
};

export default function PageOrder() {
  const { id } = useParams<{ id: string }>();
  const results = useQueries([
    {
      queryKey: ["order", { id }],
      queryFn: async () => {
        const res = await axios.get<Order>(`${API_PATHS.order}/order/${id}`);
        return res.data;
      },
    },
    {
      queryKey: "products",
      queryFn: async () => {
        const res = await axios.get<AvailableProduct[]>(
          `${API_PATHS.bff}/product/available`
        );
        return res.data;
      },
    },
  ]);
  const [
    { data: order, isLoading: isOrderLoading },
    { data: products, isLoading: isProductsLoading },
  ] = results;
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const invalidateOrder = useInvalidateOrder();

  if (isOrderLoading || isProductsLoading) return <p>loading...</p>;

  return order ? (
    <PaperLayout>
      <Typography component="h1" variant="h4" align="center">
        Manage order
      </Typography>
      <ReviewOrder address={order.delivery}/>
      <Typography variant="h6">Status:</Typography>
      <Typography variant="h6">Change status:</Typography>
      <Box py={2}>
        <Formik
          initialValues={{ comment: "" }}
          enableReinitialize
          onSubmit={(values) =>
            updateOrderStatus(
              { id: order.id, ...values },
              { onSuccess: () => invalidateOrder(order.id) }
            )
          }
        >
          {({ values, dirty, isSubmitting }: FormikProps<FormValues>) => (
            <Form autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="comment"
                    label="Comment"
                    fullWidth
                    autoComplete="off"
                    multiline
                  />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </PaperLayout>
  ) : null;
}
