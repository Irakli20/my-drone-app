"use client";

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./styles.css"; // Create an empty or custom styles file

/************************************
 * 1. ENUMS & MODELS (JS style)
 ************************************/
const UserType = {
  FARMER: "farmer",
  OPERATOR: "operator",
};

// JS equivalents to your Dart classes
// We'll just store them as normal objects.

/************************************
 * 2. GLOBAL DATA (like your lists)
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
 * 3. SCREENS & COMPONENTS
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
function LoginScreen({ onLogin, users }) {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.id === selectedUserId);
    onLogin(user);
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Drone Spraying Service</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", margin: "12px 0 6px" }}>
          Select User
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
          Login
        </button>
      </form>
    </div>
  );
}

// -- Farmer Dashboard --
function FarmerDashboard({ onLogout, user, fields, bookings }) {
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
      <h1>Farmer Dashboard</h1>
      <button onClick={onLogout} style={{ marginLeft: 12 }}>
        Logout
      </button>
      <hr />
      {/* Stats */}
      <h2>Statistics</h2>
      <p>
        Pending: {pending} &nbsp;|&nbsp; Confirmed: {confirmed} &nbsp;|&nbsp;
        Cancelled: {cancelled} &nbsp;|&nbsp; Total Area: {totalArea} ha
      </p>

      {/* Bookings */}
      <h2>My Bookings ({myBookings.length})</h2>
      {myBookings.length === 0 ? (
        <p>No bookings available.</p>
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
            <p>Chemical: {booking.sprayChemical}</p>
            <p>Dosage: {booking.dosage} gal/acre</p>
            <p>Reason: {booking.problemReason}</p>
            <p>Price: {booking.price.toFixed(2)} GEL</p>
            <button
              onClick={() => navigate(`/booking/${booking.id}`)}
              style={{ marginRight: 6 }}
            >
              Booking Details
            </button>
          </div>
        ))
      )}

      {/* Fields */}
      <h2>My Fields ({myFields.length})</h2>
      {myFields.length === 0 ? (
        <p>Add a field.</p>
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
              <p>Farmer Phone: {field.farmerMobile}</p>
              <button
                onClick={() => navigate(`/edit-field/${field.id}`)}
                style={{ marginRight: 6 }}
              >
                Edit Field
              </button>
              {!hasActiveBooking && (
                <>
                  <button
                    onClick={() => navigate(`/request-spray/${field.id}`)}
                    style={{ marginRight: 6 }}
                  >
                    Request Spray
                  </button>
                  <button
                    onClick={() => navigate(`/delete-field/${field.id}`)}
                    style={{ marginRight: 6 }}
                  >
                    Delete Field
                  </button>
                </>
              )}
            </div>
          );
        })
      )}
      <button onClick={() => navigate("/add-field")} style={{ marginTop: 12 }}>
        Add New Field
      </button>
    </div>
  );
}

// -- Operator Dashboard --
function OperatorDashboard({ onLogout, user, fields, bookings }) {
  const navigate = useNavigate();
  const allBookings = bookings;
  const allFields = fields;

  const pending = allBookings.filter((b) => b.status === "Pending").length;
  const confirmed = allBookings.filter((b) => b.status === "Confirmed").length;
  const cancelled = allBookings.filter((b) => b.status === "Cancelled").length;
  const totalArea = allBookings.reduce((sum, b) => sum + b.field.size, 0);

  return (
    <div style={{ padding: 16 }}>
      <h1>Operator Dashboard</h1>
      <button onClick={onLogout} style={{ marginLeft: 12 }}>
        Logout
      </button>
      <hr />
      <h2>Statistics</h2>
      <p>
        Pending: {pending} &nbsp;|&nbsp; Confirmed: {confirmed} &nbsp;|&nbsp;
        Cancelled: {cancelled} &nbsp;|&nbsp; Total Area: {totalArea} ha
      </p>

      <h2>All Bookings ({allBookings.length})</h2>
      {allBookings.length === 0 ? (
        <p>No bookings available.</p>
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
            <p>Chemical: {booking.sprayChemical}</p>
            <p>Dosage: {booking.dosage} gal/acre</p>
            <p>Reason: {booking.problemReason}</p>
            <p>Price: {booking.price.toFixed(2)} GEL</p>
            <button
              onClick={() => navigate(`/booking/${booking.id}`)}
              style={{ marginRight: 6 }}
            >
              Booking Details
            </button>
          </div>
        ))
      )}

      <h2>My Fields ({allFields.length})</h2>
      {allFields.length === 0 ? (
        <p>No fields available.</p>
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
            <p>Farmer Phone: {field.farmerMobile}</p>
            <button
              onClick={() => navigate(`/edit-field/${field.id}`)}
              style={{ marginRight: 6 }}
            >
              Edit Field
            </button>
            <button
              onClick={() => navigate(`/delete-field/${field.id}`)}
              style={{ marginRight: 6 }}
            >
              Delete Field
            </button>
          </div>
        ))
      )}

      <button onClick={() => navigate("/add-field")} style={{ marginTop: 12 }}>
        Add New Field
      </button>
    </div>
  );
}

// -- Add Field Screen --
function AddFieldScreen({ onAddField, user }) {
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
      alert("Field Name and Field Size are required.");
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
      <h2>Add New Field</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Field Location</label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Size (ha)</label>
          <input
            type="number"
            step="0.1"
            value={fieldSize}
            onChange={(e) => setFieldSize(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Crop Type</label>
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
          <label>Cadaster Code (File Name)</label>
          <input
            type="text"
            value={cadasterCode}
            onChange={(e) => setCadasterCode(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Farmer Mobile Phone</label>
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
          Add Field
        </button>
      </form>
    </div>
  );
}

// -- Edit Field Screen --
function EditFieldScreen({ fields, onUpdateField }) {
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
      alert("Field Name and valid Field Size are required.");
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
      <h2>Edit Field</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Field Location</label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Size (ha)</label>
          <input
            type="number"
            step="0.1"
            value={fieldSize}
            onChange={(e) => setFieldSize(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Crop Type</label>
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
          <label>Cadaster Code (File Name)</label>
          <input
            type="text"
            value={cadasterCode}
            onChange={(e) => setCadasterCode(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Farmer Mobile Phone</label>
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
          Save Changes
        </button>
      </form>
    </div>
  );
}

// -- Delete Field “Screen” (just a small confirm) --
function DeleteFieldScreen({ fields, onDeleteField, bookings }) {
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
      <h2>Delete Field</h2>
      {hasActiveBooking ? (
        <p style={{ color: "red" }}>
          Cannot delete this field—it has an active booking!
        </p>
      ) : (
        <>
          <p>Are you sure you want to delete this field?</p>
          <button
            onClick={handleDelete}
            style={{ marginRight: 8, color: "white", background: "red" }}
          >
            Delete Field
          </button>
        </>
      )}
    </div>
  );
}

// -- Booking Detail Screen --
function BookingDetailScreen({ user, bookings, onUpdateBooking }) {
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
    alert("Booking cancelled successfully!");
    navigate(-1);
  };

  const handleConfirmPendingToggle = () => {
    // If it’s Pending, set to Confirmed; if Confirmed, set to Pending
    let newStatus = booking.status === "Pending" ? "Confirmed" : "Pending";
    const updated = { ...booking, status: newStatus };
    onUpdateBooking(updated);
    if (newStatus === "Confirmed") {
      alert("Booking confirmed successfully!");
    } else {
      alert(`Booking set to ${newStatus}`);
    }
    navigate(-1);
  };

  return (
    <div style={{ padding: 16 }}>
      <BackButton />
      <h2>Booking Details</h2>
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
        <p>Chemical: {booking.sprayChemical}</p>
        <p>Dosage: {booking.dosage} gal/acre</p>
        <p>Reason: {booking.problemReason}</p>
        <p>Price (GEL): {booking.price.toFixed(2)}</p>
        <hr />
        <h4>Field Information</h4>
        <p>Farmer Mobile Phone: {booking.field.farmerMobile}</p>
        <p>File Name: {booking.field.details.cadasterCode}</p>
        {/* Show weather forecast, crop data, etc. if you like */}
      </div>
      <br />
      {booking.status !== "Cancelled" && (
        <button
          onClick={handleCancel}
          style={{ marginRight: 8, background: "red", color: "#fff" }}
        >
          Cancel Booking
        </button>
      )}
      {user.userType === UserType.OPERATOR &&
        booking.status !== "Cancelled" && (
          <button
            onClick={handleConfirmPendingToggle}
            style={{ background: "green", color: "#fff" }}
          >
            {booking.status === "Pending"
              ? "Confirm Booking"
              : "Set to Pending"}
          </button>
        )}
    </div>
  );
}

// -- Request Spray Screen --
function RequestSprayScreen({ user, fields, onAddBooking }) {
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
      alert("Please select a date range.");
      return;
    }
    if (!dosage || isNaN(dosage) || dosage <= 0) {
      alert("Please enter a valid dosage.");
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
      <h2>Request Spray Service - {field.name}</h2>
      <p>Estimated Price: {pricePreview.toFixed(2)} GEL</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Chemical</label>
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
          <label>Dosage (gal/acre)</label>
          <input
            type="number"
            step="0.1"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Date Range</label>
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
          Submit Request
        </button>
      </form>
    </div>
  );
}

/************************************
 * 4. MAIN APP
 ************************************/
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [fields, setFields] = useState(initialFields);
  const [bookings, setBookings] = useState(initialBookings);

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
            element={<LoginScreen onLogin={handleLogin} users={users} />}
          />
        ) : loggedInUser.userType === UserType.FARMER ? (
          <>
            {/* Farmer routes */}
            <Route
              path="/"
              element={
                <FarmerDashboard
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
                  user={loggedInUser}
                  onAddField={handleAddField}
                />
              }
            />
            <Route
              path="/edit-field/:id"
              element={
                <EditFieldScreen
                  fields={fields}
                  onUpdateField={handleUpdateField}
                />
              }
            />
            <Route
              path="/delete-field/:id"
              element={
                <DeleteFieldScreen
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
                  user={loggedInUser}
                  onAddField={handleAddField}
                />
              }
            />
            <Route
              path="/edit-field/:id"
              element={
                <EditFieldScreen
                  fields={fields}
                  onUpdateField={handleUpdateField}
                />
              }
            />
            <Route
              path="/delete-field/:id"
              element={
                <DeleteFieldScreen
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
