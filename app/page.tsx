"use client";

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import "./styles.css"; // Create an empty or custom styles file

/************************************
 * 1. LANGUAGE SUPPORT
 ************************************/
const AppLanguage = {
  ENGLISH: "en",
  GEORGIAN: "ge",
};

const translations = {
  en: {
    appTitle: " Spraying Service",
    loginTitle: "Drone Spraying Service",
    selectUser: "Select User",
    loginButton: "Login",
    logout: "Logout",
    farmerDashboard: "Farmer Dashboard",
    operatorDashboard: "Operator Dashboard",
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    totalArea: "Total Area",
    myBookings: "My Bookings",
    noBookings: "No bookings available.",
    myFields: "My Fields",
    noFields: "No fields available.",
    addNewField: "Add New Field",
    requestSpray: "Request Spray",
    editField: "Edit Field",
    deleteField: "Delete Field",
    confirmDelete: "Are you sure you want to delete this field?",
    farmerPhone: "Farmer Phone",
    price: "Price",
    bookingCancelled: "Booking cancelled successfully!",
    bookingSetTo: "Booking set to",
    bookingConfirmed: "Booking confirmed successfully!",
    submitRequest: "Submit Request",
    pickDateRange: "Pick Date Range",
    noDateSelected: "No date range selected",
    dateRangeRequired: "Please select a date range.",
    requestSprayService: "Request Spray Service",
    dateRange: "Date Range",
    sprayChemical: "Chemical",
    dosage: "Dosage",
    reason: "Reason",
    priceGEL: "Price (GEL)",
    allBookings: "All Bookings",
    addField: "Add Field",
    fieldName: "Field Location",
    fieldSize: "Size (ha)",
    cropType: "Crop Type",
    cadasterCode: "Cadaster Code (File Name)",
    farmerMobile: "Farmer Mobile Phone",
    saveChanges: "Save Changes",
    editFieldScreen: "Edit Field",
    estimatedPrice: "Estimated Price:",
    language: "Language",
    bookingDetails: "Booking Details",
    fieldInformation: "Field Information",
    fileName: "File Name",
  },
  ge: {
    appTitle: "დრონით შეწამვლის სერვისი",
    loginTitle: "დრონით შეწამვლის სერვისი",
    selectUser: "აირჩიეთ მომხმარებელი",
    loginButton: "შესვლა",
    logout: "გასვლა",
    farmerDashboard: "ფერმერის დაფა",
    operatorDashboard: "ოპერატორის დაფა",
    pending: "მოლოდინში",
    confirmed: "მოთხოვნის დადასტურება",
    cancelled: "მოთხოვნის გაუქმება",
    totalArea: "ნაკვეთების საერთო ფართობი",
    myBookings: "ჩემი ჯავშნები",
    noBookings: "მოთხოვნა ვერ მოიძებნა.",
    myFields: "ჩემი ნაკვეთები",
    noFields: "დაამატეთ ნაკვეთი",
    addNewField: "ნაკვეთის დამატება",
    requestSpray: "დრონით შეწამვლის მოთხოვნა",
    editField: "შეწამვლის მოთხოვნის შეცვლა",
    deleteField: "ნაკვეთის წაშლა",
    confirmDelete: "ნამდვილად გსურთ ნაკვეთის წაშლა?",
    farmerPhone: "ფერმერის ტელეფონი",
    price: "ფასი",
    bookingCancelled: "მოთხოვნა წარმატებით გაუქმდა!",
    bookingSetTo: "მოთხოვნა შეიცვალა:",
    bookingConfirmed: "მოთხოვნა დადასტურდა!",
    submitRequest: "გაგზავნა",
    pickDateRange: "აირჩიეთ თქვენთვის სასურველი პერიოდი შესაწამლად",
    noDateSelected: "შეწამვლის პერიოდი არ არის არჩეული",
    dateRangeRequired: "გთხოვთ, აირჩიოთ პერიოდი.",
    requestSprayService: "შეწამვლის მოთხოვნა",
    dateRange: "შეწამვლის პერიოდი",
    sprayChemical: "წამალი",
    dosage: "დოზა",
    reason: "შეწამვლის მიზეზი",
    priceGEL: "ფასი (GEL)",
    allBookings: "ყველა მოთხოვნა",
    addField: "ნაკვეთის დამატება",
    fieldName: "ლოკაცია",
    fieldSize: "ფართობი (ჰა)",
    cropType: "კულტურა",
    cadasterCode: "საკადასტრო კოდი (ფაილი)",
    farmerMobile: "საკონტაქტო ტელეფონი",
    saveChanges: "ცვლილებების შენახვა",
    editFieldScreen: "ნაკვეთის რედაქტირება",
    estimatedPrice: "შესამვლის ფასი:",
    language: "ენა",
    bookingDetails: "მოთხოვნის დეტალები",
    fieldInformation: "ნაკვეთის შესახებ",
    fileName: "ფაილის სახელი",
  },
};

function t(lang, key) {
  return translations[lang]?.[key] || key;
}

/************************************
 * 2. ENUMS & MODELS (JS style)
 ************************************/
const UserType = {
  FARMER: "farmer",
  OPERATOR: "operator",
};

// JS equivalents to your Dart classes
// We'll just store them as normal objects.

/************************************
 * 3. GLOBAL DATA (like your lists)
 ************************************/
const initialUsers = [
  {
    id: "1",
    name: "Irakli Shengelia",
    userType: UserType.FARMER,
  },
  {
    id: "2",
    name: "Irakli Shengelia2",
    userType: UserType.OPERATOR,
  },
];

function nowPlusDays(days) {
  // Helper to get a date [days] in the future
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// We'll define your “fields” array
const initialFields = [
  {
    id: "1",
    farmerId: "1",
    name: "North Field",
    size: 10,
    cropType: "Corn",
    farmerMobile: "599 223389",
    details: {
      fieldId: "1",
      cadasterCode: "cadaster_north_field.pdf",
      crop: {
        stemCount: 100,
        ndviIndex: 0.82,
        plantHeight: 180.0,
        plantDensity: 8.5,
        predictedYield: 12.3,
        multispectralData: {
          RED: 0.12,
          NIR: 0.85,
          NDRE: 0.45,
          GNDVI: 0.75,
        },
      },
      weatherForecast: [
        {
          date: new Date(),
          temperature: 22.5,
          windSpeed: 4.2,
          precipitation: 0.0,
        },
        {
          date: nowPlusDays(1),
          temperature: 23.0,
          windSpeed: 3.8,
          precipitation: 0.1,
        },
      ],
    },
  },
];

// “bookings” array
const initialBookings = [
  {
    id: "100",
    farmerId: "1",
    field: initialFields[0],
    dateRange: {
      start: new Date(),
      end: nowPlusDays(2),
    },
    status: "Pending",
    sprayChemical: "Glyphosate",
    dosage: 2.5,
    problemReason: "Weed Control",
    price: 10 * 50,
  },
];

/************************************
 * 4. SCREENS & COMPONENTS
 ************************************/

// -- Helper components --

function StatusChip({ status }) {
  let backgroundColor = "#eee";
  let textColor = "#000";
  switch (status) {
    case "Pending":
      backgroundColor = "#ffe8cc";
      textColor = "#d56500";
      break;
    case "Confirmed":
      backgroundColor = "#d5f5e3";
      textColor = "#186a3b";
      break;
    case "Cancelled":
      backgroundColor = "#f9cccc";
      textColor = "#b03a2e";
      break;
    default:
      backgroundColor = "#ddd";
      textColor = "#333";
  }
  return (
    <span
      style={{
        backgroundColor,
        color: textColor,
        padding: "4px 8px",
        borderRadius: "8px",
        fontSize: "0.85rem",
      }}
    >
      {status}
    </span>
  );
}

function CropIcon({ cropType }) {
  const map = {
    Corn: "🌽",
    Wheat: "🌾",
    Sunflowers: "🌻",
    Vegetables: "🥕",
    Orchard: "🌳",
  };

  return <span style={{ marginRight: 16 }}>{map[cropType] || "🚜"}</span>;
}

// We’ll keep a simple “Back” button. In Flutter we had Navigator.pop; in React Router we do useNavigate().
function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there is actual browser history available:
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Otherwise go to the home page ("/")
      navigate("/");
    }
  };

  return (
    <button style={{ marginRight: 8 }} onClick={handleBack}>
      {"< Back"}
    </button>
  );
}

// -- Login Screen --
function LoginScreen({ currentLanguage, onLanguageToggle, onLogin, users }) {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.id === selectedUserId);
    onLogin(user);
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>{t(currentLanguage, "loginTitle")}</h1>
      <button onClick={onLanguageToggle} style={{ float: "right" }}>
        {t(currentLanguage, "language")}
      </button>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", margin: "12px 0 6px" }}>
          {t(currentLanguage, "selectUser")}
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: 200 }}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.userType === UserType.FARMER ? "Farmer" : "Operator"}
              )
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            backgroundColor: "green",
            color: "#fff",
          }}
        >
          {t(currentLanguage, "loginButton")}
        </button>
      </form>
    </div>
  );
}

// -- Farmer Dashboard --
function FarmerDashboard({
  currentLanguage,
  onLanguageToggle,
  onLogout,
  user,
  fields,
  bookings,
}) {
  const navigate = useNavigate();
  const myFields = fields.filter((f) => f.farmerId === user.id);
  const myBookings = bookings.filter((b) => b.farmerId === user.id);

  const pending = myBookings.filter((b) => b.status === "Pending").length;
  const confirmed = myBookings.filter((b) => b.status === "Confirmed").length;
  const cancelled = myBookings.filter((b) => b.status === "Cancelled").length;
  const totalArea = myBookings.reduce(
    (sum, b) => sum + (b.field?.size || 0),
    0
  );

  return (
    <div style={{ padding: 16 }}>
      <h1>{t(currentLanguage, "farmerDashboard")}</h1>
      <button onClick={onLanguageToggle}>
        {t(currentLanguage, "language")}
      </button>
      <button onClick={onLogout} style={{ marginLeft: 12 }}>
        {t(currentLanguage, "logout")}
      </button>
      <hr />
      {/* Stats */}
      <h2>Statistics</h2>
      <p>
        {t(currentLanguage, "pending")}: {pending} &nbsp;|&nbsp;
        {t(currentLanguage, "confirmed")}: {confirmed} &nbsp;|&nbsp;
        {t(currentLanguage, "cancelled")}: {cancelled} &nbsp;|&nbsp;
        {t(currentLanguage, "totalArea")}: {totalArea} ha
      </p>

      {/* Bookings */}
      <h2>
        {t(currentLanguage, "myBookings")} ({myBookings.length})
      </h2>
      {myBookings.length === 0 ? (
        <p>{t(currentLanguage, "noBookings")}</p>
      ) : (
        myBookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <h3>
              <StatusChip status={booking.status} /> - {booking.field.name}
            </h3>
            <p>
              {booking.field.size} ha - {booking.field.cropType}
            </p>
            <p>
              {booking.dateRange.start.toLocaleDateString()} -{" "}
              {booking.dateRange.end.toLocaleDateString()}
            </p>
            <p>
              {t(currentLanguage, "sprayChemical")}: {booking.sprayChemical}
            </p>
            <p>
              {t(currentLanguage, "dosage")}: {booking.dosage} gal/acre
            </p>
            <p>
              {t(currentLanguage, "reason")}: {booking.problemReason}
            </p>
            <p>
              {t(currentLanguage, "price")}: {booking.price.toFixed(2)} GEL
            </p>
            <button
              onClick={() => navigate(`/booking/${booking.id}`)}
              style={{ marginRight: 6 }}
            >
              {t(currentLanguage, "bookingDetails")}
            </button>
          </div>
        ))
      )}

      {/* Fields */}
      <h2>
        {t(currentLanguage, "myFields")} ({myFields.length})
      </h2>
      {myFields.length === 0 ? (
        <p>{t(currentLanguage, "noFields")}</p>
      ) : (
        myFields.map((field) => {
          // Check if this field is locked by a pending/confirmed booking
          const hasActiveBooking = bookings.some(
            (b) =>
              b.field.id === field.id &&
              (b.status === "Pending" || b.status === "Confirmed")
          );
          return (
            <div
              key={field.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            >
              <h3>
                <CropIcon cropType={field.cropType} />
                {field.name}
              </h3>
              <p>
                {field.size} ha - {field.cropType}
              </p>
              <p>
                {t(currentLanguage, "farmerPhone")}: {field.farmerMobile}
              </p>
              <button
                onClick={() => navigate(`/edit-field/${field.id}`)}
                style={{ marginRight: 6 }}
              >
                {t(currentLanguage, "editField")}
              </button>
              {!hasActiveBooking && (
                <>
                  <button
                    onClick={() => navigate(`/request-spray/${field.id}`)}
                    style={{ marginRight: 6 }}
                  >
                    {t(currentLanguage, "requestSpray")}
                  </button>
                  <button
                    onClick={() => navigate(`/delete-field/${field.id}`)}
                    style={{ marginRight: 6 }}
                  >
                    {t(currentLanguage, "deleteField")}
                  </button>
                </>
              )}
            </div>
          );
        })
      )}
      <button onClick={() => navigate("/add-field")} style={{ marginTop: 12 }}>
        {t(currentLanguage, "addNewField")}
      </button>
    </div>
  );
}

// -- Operator Dashboard --
function OperatorDashboard({
  currentLanguage,
  onLanguageToggle,
  onLogout,
  user,
  fields,
  bookings,
}) {
  const navigate = useNavigate();
  const allBookings = bookings;
  const allFields = fields;

  const pending = allBookings.filter((b) => b.status === "Pending").length;
  const confirmed = allBookings.filter((b) => b.status === "Confirmed").length;
  const cancelled = allBookings.filter((b) => b.status === "Cancelled").length;
  const totalArea = allBookings.reduce((sum, b) => sum + b.field.size, 0);

  return (
    <div style={{ padding: 16 }}>
      <h1>{t(currentLanguage, "operatorDashboard")}</h1>
      <button onClick={onLanguageToggle}>
        {t(currentLanguage, "language")}
      </button>
      <button onClick={onLogout} style={{ marginLeft: 12 }}>
        {t(currentLanguage, "logout")}
      </button>
      <hr />
      <h2>Statistics</h2>
      <p>
        {t(currentLanguage, "pending")}: {pending} &nbsp;|&nbsp;
        {t(currentLanguage, "confirmed")}: {confirmed} &nbsp;|&nbsp;
        {t(currentLanguage, "cancelled")}: {cancelled} &nbsp;|&nbsp;
        {t(currentLanguage, "totalArea")}: {totalArea} ha
      </p>

      <h2>
        {t(currentLanguage, "allBookings")} ({allBookings.length})
      </h2>
      {allBookings.length === 0 ? (
        <p>{t(currentLanguage, "noBookings")}</p>
      ) : (
        allBookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <h3>
              <StatusChip status={booking.status} /> - {booking.field.name}
            </h3>
            <p>
              {booking.field.size} ha - {booking.field.cropType}
            </p>
            <p>
              {booking.dateRange.start.toLocaleDateString()} -{" "}
              {booking.dateRange.end.toLocaleDateString()}
            </p>
            <p>
              {t(currentLanguage, "sprayChemical")}: {booking.sprayChemical}
            </p>
            <p>
              {t(currentLanguage, "dosage")}: {booking.dosage} gal/acre
            </p>
            <p>
              {t(currentLanguage, "reason")}: {booking.problemReason}
            </p>
            <p>
              {t(currentLanguage, "price")}: {booking.price.toFixed(2)} GEL
            </p>
            <button
              onClick={() => navigate(`/booking/${booking.id}`)}
              style={{ marginRight: 6 }}
            >
              {t(currentLanguage, "bookingDetails")}
            </button>
          </div>
        ))
      )}

      <h2>
        {t(currentLanguage, "myFields")} ({allFields.length})
      </h2>
      {allFields.length === 0 ? (
        <p>{t(currentLanguage, "noFields")}</p>
      ) : (
        allFields.map((field) => (
          <div
            key={field.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <h3>
              <CropIcon cropType={field.cropType} />
              {field.name}
            </h3>
            <p>
              {field.size} ha - {field.cropType}
            </p>
            <p>
              {t(currentLanguage, "farmerPhone")}: {field.farmerMobile}
            </p>
            <button
              onClick={() => navigate(`/edit-field/${field.id}`)}
              style={{ marginRight: 6 }}
            >
              {t(currentLanguage, "editField")}
            </button>
            <button
              onClick={() => navigate(`/delete-field/${field.id}`)}
              style={{ marginRight: 6 }}
            >
              {t(currentLanguage, "deleteField")}
            </button>
          </div>
        ))
      )}

      <button onClick={() => navigate("/add-field")} style={{ marginTop: 12 }}>
        {t(currentLanguage, "addNewField")}
      </button>
    </div>
  );
}

// -- Add Field Screen --
function AddFieldScreen({ currentLanguage, onAddField, user }) {
  const navigate = useNavigate();
  const [fieldName, setFieldName] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [cropType, setCropType] = useState("Corn");
  const [cadasterCode, setCadasterCode] = useState("");
  const [farmerMobile, setFarmerMobile] = useState("");

  const crops = [
    "Corn",
    "Wheat",
    "Barley",
    "Orchard",
    "Vegetables",
    "Sunflowers",
    // etc...
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fieldName || !fieldSize || !farmerMobile) {
      alert(
        t(currentLanguage, "fieldName") +
          " / " +
          t(currentLanguage, "fieldSize")
      );
      return;
    }
    const newField = {
      id: Date.now().toString(),
      farmerId: user.id,
      name: fieldName,
      size: parseFloat(fieldSize),
      cropType,
      farmerMobile,
      details: {
        fieldId: Date.now().toString(),
        cadasterCode,
        crop: {
          stemCount: 0,
          ndviIndex: 0,
          plantHeight: 0,
          plantDensity: 0,
          predictedYield: 0,
          multispectralData: {},
        },
        weatherForecast: [],
      },
    };
    onAddField(newField);
    navigate(-1);
  };

  return (
    <div style={{ padding: 16 }}>
      <BackButton />
      <h2>{t(currentLanguage, "addNewField")}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "fieldName")}</label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "fieldSize")}</label>
          <input
            type="number"
            step="0.1"
            value={fieldSize}
            onChange={(e) => setFieldSize(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "cropType")}</label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "cadasterCode")}</label>
          <input
            type="text"
            value={cadasterCode}
            onChange={(e) => setCadasterCode(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "farmerMobile")}</label>
          <input
            type="text"
            value={farmerMobile}
            onChange={(e) => setFarmerMobile(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "green",
            color: "#fff",
          }}
        >
          {t(currentLanguage, "addField")}
        </button>
      </form>
    </div>
  );
}

// -- Edit Field Screen --
function EditFieldScreen({ currentLanguage, fields, onUpdateField }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const field = fields.find((f) => f.id === id);
  if (!field) {
    return (
      <div style={{ padding: 16 }}>
        <BackButton />
        <p>Field not found!</p>
      </div>
    );
  }

  const [fieldName, setFieldName] = useState(field.name);
  const [fieldSize, setFieldSize] = useState(field.size.toString());
  const [cropType, setCropType] = useState(field.cropType);
  const [cadasterCode, setCadasterCode] = useState(field.details.cadasterCode);
  const [farmerMobile, setFarmerMobile] = useState(field.farmerMobile);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fieldName || !fieldSize || isNaN(fieldSize)) {
      alert(
        t(currentLanguage, "fieldName") +
          " / " +
          t(currentLanguage, "fieldSize")
      );
      return;
    }
    const updated = {
      ...field,
      name: fieldName,
      size: parseFloat(fieldSize),
      cropType,
      farmerMobile,
      details: {
        ...field.details,
        cadasterCode,
      },
    };
    onUpdateField(updated);
    navigate(-1);
  };

  const crops = [
    "Corn",
    "Wheat",
    "Barley",
    "Orchard",
    "Vegetables",
    "Sunflowers",
  ];

  return (
    <div style={{ padding: 16 }}>
      <BackButton />
      <h2>{t(currentLanguage, "editFieldScreen")}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "fieldName")}</label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "fieldSize")}</label>
          <input
            type="number"
            step="0.1"
            value={fieldSize}
            onChange={(e) => setFieldSize(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "cropType")}</label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "cadasterCode")}</label>
          <input
            type="text"
            value={cadasterCode}
            onChange={(e) => setCadasterCode(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "farmerMobile")}</label>
          <input
            type="text"
            value={farmerMobile}
            onChange={(e) => setFarmerMobile(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "orange",
            color: "#fff",
          }}
        >
          {t(currentLanguage, "saveChanges")}
        </button>
      </form>
    </div>
  );
}

// -- Delete Field “Screen” (just a small confirm) --
function DeleteFieldScreen({
  currentLanguage,
  fields,
  onDeleteField,
  bookings,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const field = fields.find((f) => f.id === id);
  if (!field) {
    return (
      <div style={{ padding: 16 }}>
        <BackButton />
        <p>Field not found!</p>
      </div>
    );
  }
  // Some fields might be locked by active bookings. We check that here:
  const hasActiveBooking = bookings.some(
    (b) =>
      b.field.id === field.id &&
      (b.status === "Pending" || b.status === "Confirmed")
  );

  const handleDelete = () => {
    onDeleteField(field.id);
    navigate(-1);
  };

  return (
    <div style={{ padding: 16 }}>
      <BackButton />
      <h2>{t(currentLanguage, "deleteField")}</h2>
      {hasActiveBooking ? (
        <p style={{ color: "red" }}>
          Cannot delete this field—it has an active booking!
        </p>
      ) : (
        <>
          <p>{t(currentLanguage, "confirmDelete")}</p>
          <button
            onClick={handleDelete}
            style={{ marginRight: 8, color: "white", background: "red" }}
          >
            {t(currentLanguage, "deleteField")}
          </button>
        </>
      )}
    </div>
  );
}

// -- Booking Detail Screen --
function BookingDetailScreen({
  currentLanguage,
  user,
  bookings,
  onUpdateBooking,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div style={{ padding: 16 }}>
        <BackButton />
        <p>Booking not found!</p>
      </div>
    );
  }

  const handleCancel = () => {
    const updated = { ...booking, status: "Cancelled" };
    onUpdateBooking(updated);
    alert(t(currentLanguage, "bookingCancelled"));
    navigate(-1);
  };

  const handleConfirmPendingToggle = () => {
    // If it’s Pending, set to Confirmed; if Confirmed, set to Pending
    let newStatus = booking.status === "Pending" ? "Confirmed" : "Pending";
    const updated = { ...booking, status: newStatus };
    onUpdateBooking(updated);
    if (newStatus === "Confirmed") {
      alert(t(currentLanguage, "bookingConfirmed"));
    } else {
      alert(`${t(currentLanguage, "bookingSetTo")} ${newStatus}`);
    }
    navigate(-1);
  };

  return (
    <div style={{ padding: 16 }}>
      <BackButton />
      <h2>{t(currentLanguage, "bookingDetails")}</h2>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 8 }}>
        <StatusChip status={booking.status} />
        <h3>{booking.field.name}</h3>
        <p>
          {booking.field.size} ha - {booking.field.cropType}
        </p>
        <p>
          {booking.dateRange.start.toLocaleString()} -{" "}
          {booking.dateRange.end.toLocaleString()}
        </p>
        <p>
          {t(currentLanguage, "sprayChemical")}: {booking.sprayChemical}
        </p>
        <p>
          {t(currentLanguage, "dosage")}: {booking.dosage} gal/acre
        </p>
        <p>
          {t(currentLanguage, "reason")}: {booking.problemReason}
        </p>
        <p>
          {t(currentLanguage, "priceGEL")}: {booking.price.toFixed(2)}
        </p>
        <hr />
        <h4>{t(currentLanguage, "fieldInformation")}</h4>
        <p>
          {t(currentLanguage, "farmerMobile")}: {booking.field.farmerMobile}
        </p>
        <p>
          {t(currentLanguage, "fileName")}: {booking.field.details.cadasterCode}
        </p>
        {/* Show weather forecast, crop data, etc. if you like */}
      </div>
      <br />
      {booking.status !== "Cancelled" && (
        <button
          onClick={handleCancel}
          style={{ marginRight: 8, background: "red", color: "#fff" }}
        >
          {t(currentLanguage, "cancelled")}
        </button>
      )}
      {user.userType === UserType.OPERATOR &&
        booking.status !== "Cancelled" && (
          <button
            onClick={handleConfirmPendingToggle}
            style={{ background: "green", color: "#fff" }}
          >
            {booking.status === "Pending"
              ? t(currentLanguage, "confirmed")
              : t(currentLanguage, "pending")}
          </button>
        )}
    </div>
  );
}

// -- Request Spray Screen --
function RequestSprayScreen({ currentLanguage, user, fields, onAddBooking }) {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const field = fields.find((f) => f.id === fieldId);
  if (!field) {
    return (
      <div style={{ padding: 16 }}>
        <BackButton />
        <p>Field not found!</p>
      </div>
    );
  }

  const [chemical, setChemical] = useState("Glyphosate");
  const [dosage, setDosage] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const chemicals = [
    "Glyphosate",
    "Paraquat",
    "Atrazine",
    "Dicamba",
    "2,4-D",
    "Chlorpyrifos",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert(t(currentLanguage, "dateRangeRequired"));
      return;
    }
    if (!dosage || isNaN(dosage) || dosage <= 0) {
      alert(t(currentLanguage, "dosage"));
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      alert("End date must be after start date");
      return;
    }
    const price = field.size * 50; // your formula

    const newBooking = {
      id: Date.now().toString(),
      farmerId: user.id,
      field,
      dateRange: { start, end },
      status: "Pending",
      sprayChemical: chemical,
      dosage: parseFloat(dosage),
      problemReason: reason,
      price,
    };
    onAddBooking(newBooking);
    navigate(-1);
  };

  const pricePreview = field.size * 50;

  return (
    <div style={{ padding: 16 }}>
      <BackButton />
      <h2>
        {t(currentLanguage, "requestSprayService")} - {field.name}
      </h2>
      <p>
        {t(currentLanguage, "estimatedPrice")} {pricePreview.toFixed(2)} GEL
      </p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "sprayChemical")}</label>
          <select
            value={chemical}
            onChange={(e) => setChemical(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {chemicals.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "dosage")} (gal/acre)</label>
          <input
            type="number"
            step="0.1"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "reason")}</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>{t(currentLanguage, "dateRange")}</label>
          <br />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "green",
            color: "#fff",
          }}
        >
          {t(currentLanguage, "submitRequest")}
        </button>
      </form>
    </div>
  );
}

/************************************
 * 5. MAIN APP
 ************************************/
export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState(AppLanguage.GEORGIAN);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [fields, setFields] = useState(initialFields);
  const [bookings, setBookings] = useState(initialBookings);

  const toggleLanguage = () => {
    setCurrentLanguage((prev) =>
      prev === AppLanguage.GEORGIAN ? AppLanguage.ENGLISH : AppLanguage.GEORGIAN
    );
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const handleAddField = (newField) => {
    setFields((prev) => [...prev, newField]);
  };

  const handleUpdateField = (updatedField) => {
    setFields((prev) =>
      prev.map((f) => (f.id === updatedField.id ? updatedField : f))
    );
  };

  const handleDeleteField = (fieldId) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
    setBookings((prev) => prev.filter((b) => b.field.id !== fieldId));
  };

  const handleAddBooking = (newBooking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  const handleUpdateBooking = (updated) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  return (
    <Router>
      <Routes>
        {/* If not logged in, show login */}
        {!loggedInUser ? (
          <Route
            path="*"
            element={
              <LoginScreen
                currentLanguage={currentLanguage}
                onLanguageToggle={toggleLanguage}
                onLogin={handleLogin}
                users={users}
              />
            }
          />
        ) : loggedInUser.userType === UserType.FARMER ? (
          <>
            {/* Farmer routes */}
            <Route
              path="/"
              element={
                <FarmerDashboard
                  currentLanguage={currentLanguage}
                  onLanguageToggle={toggleLanguage}
                  onLogout={handleLogout}
                  user={loggedInUser}
                  fields={fields}
                  bookings={bookings}
                />
              }
            />
            <Route
              path="/add-field"
              element={
                <AddFieldScreen
                  currentLanguage={currentLanguage}
                  user={loggedInUser}
                  onAddField={handleAddField}
                />
              }
            />
            <Route
              path="/edit-field/:id"
              element={
                <EditFieldScreen
                  currentLanguage={currentLanguage}
                  fields={fields}
                  onUpdateField={handleUpdateField}
                />
              }
            />
            <Route
              path="/delete-field/:id"
              element={
                <DeleteFieldScreen
                  currentLanguage={currentLanguage}
                  fields={fields}
                  bookings={bookings}
                  onDeleteField={handleDeleteField}
                />
              }
            />
            <Route
              path="/booking/:id"
              element={
                <BookingDetailScreen
                  currentLanguage={currentLanguage}
                  user={loggedInUser}
                  bookings={bookings}
                  onUpdateBooking={handleUpdateBooking}
                />
              }
            />
            <Route
              path="/request-spray/:fieldId"
              element={
                <RequestSprayScreen
                  currentLanguage={currentLanguage}
                  user={loggedInUser}
                  fields={fields}
                  onAddBooking={handleAddBooking}
                />
              }
            />
            {/* If no specific route, go to home (FarmerDashboard) */}
            <Route
              path="*"
              element={
                <FarmerDashboard
                  currentLanguage={currentLanguage}
                  onLanguageToggle={toggleLanguage}
                  onLogout={handleLogout}
                  user={loggedInUser}
                  fields={fields}
                  bookings={bookings}
                />
              }
            />
          </>
        ) : (
          <>
            {/* Operator routes */}
            <Route
              path="/"
              element={
                <OperatorDashboard
                  currentLanguage={currentLanguage}
                  onLanguageToggle={toggleLanguage}
                  onLogout={handleLogout}
                  user={loggedInUser}
                  fields={fields}
                  bookings={bookings}
                />
              }
            />
            <Route
              path="/add-field"
              element={
                <AddFieldScreen
                  currentLanguage={currentLanguage}
                  user={loggedInUser}
                  onAddField={handleAddField}
                />
              }
            />
            <Route
              path="/edit-field/:id"
              element={
                <EditFieldScreen
                  currentLanguage={currentLanguage}
                  fields={fields}
                  onUpdateField={handleUpdateField}
                />
              }
            />
            <Route
              path="/delete-field/:id"
              element={
                <DeleteFieldScreen
                  currentLanguage={currentLanguage}
                  fields={fields}
                  bookings={bookings}
                  onDeleteField={handleDeleteField}
                />
              }
            />
            <Route
              path="/booking/:id"
              element={
                <BookingDetailScreen
                  currentLanguage={currentLanguage}
                  user={loggedInUser}
                  bookings={bookings}
                  onUpdateBooking={handleUpdateBooking}
                />
              }
            />
            <Route
              path="/request-spray/:fieldId"
              element={
                <RequestSprayScreen
                  currentLanguage={currentLanguage}
                  user={loggedInUser}
                  fields={fields}
                  onAddBooking={handleAddBooking}
                />
              }
            />
            <Route
              path="*"
              element={
                <OperatorDashboard
                  currentLanguage={currentLanguage}
                  onLanguageToggle={toggleLanguage}
                  onLogout={handleLogout}
                  user={loggedInUser}
                  fields={fields}
                  bookings={bookings}
                />
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}
