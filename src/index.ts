import { fastify } from "fastify"
import cors from '@fastify/cors'
import admin from 'firebase-admin'
import { getStorage } from 'firebase-admin/storage'

import Products from "./routes/products"
import Groups from "./routes/groups"
import Suppliers from "./routes/suppliers"
import Clients from "./routes/clients"
import Contact from "./routes/contact"

import firebaseAccountCredentials  from './credentials/serviceAccountKey.json'
import UploadImage from "./routes/uploadImage"
import Home from "./routes/home/home"
import HomeMain from "./routes/home/main"
import HomeWelcome from "./routes/home/welcome"
import HomeCatalog from "./routes/home/catalog"
import AboutUsBanners from "./routes/aboutUs/banners"
import AboutUs from "./routes/aboutUs/aboutUs"
import AboutUsHistory from "./routes/aboutUs/history"
import AboutUsTeam from "./routes/aboutUs/team"
import AboutUsSpaceBanners from "./routes/aboutUs/bannersSpace"
import AboutUsSpace from "./routes/aboutUs/space"
import AboutUsValues from "./routes/aboutUs/values"
import AboutUsDirectors from "./routes/aboutUs/directors"
import SuppliersScreen from "./routes/suppliers/suppliers"
import Users from "./routes/user"
import SendMessage from "./routes/sendMessage"
import PrivacyPolicy from "./routes/suppliers/privacyPolicy"
import HomeProducts from "./routes/home/products"
import ContactEmail from "./routes/contactEmail"
import Catalog from "./routes/catalog"
import Logos from "./routes/logos"
import TokenVerify from "./routes/tokenVerify"
import Category from "./routes/category"

const serviceAccount = firebaseAccountCredentials  as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://medicall-farma-default-rtdb.firebaseio.com"
});

export const bucket = getStorage().bucket('gs://medicall-farma.appspot.com');

const app = fastify()

app.get('/', () => 'Server is running!')

app.register(Products)
app.register(Groups)
app.register(Category)
app.register(Suppliers)
app.register(Clients)
app.register(Home)
app.register(HomeMain)
app.register(HomeWelcome)
app.register(HomeCatalog)
app.register(AboutUs)
app.register(AboutUsBanners)
app.register(AboutUsHistory)
app.register(AboutUsTeam)
app.register(AboutUsSpaceBanners)
app.register(AboutUsSpace)
app.register(AboutUsValues)
app.register(AboutUsDirectors)
app.register(SuppliersScreen)
app.register(Contact)
app.register(UploadImage)
app.register(Users)
app.register(SendMessage)
app.register(PrivacyPolicy)
app.register(HomeProducts)
app.register(ContactEmail)
app.register(Catalog)
app.register(Logos)
app.register(TokenVerify)

app.register(cors, {
  origin: true,
})

app.listen({
  host: '0.0.0.0',
  port: Number(process.env.PORT) || 3333
})
  .then(() => {
    console.log('HTTP server running!')
  })