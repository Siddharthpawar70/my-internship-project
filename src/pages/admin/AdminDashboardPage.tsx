import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Wrench,
  Tag,
  Users,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  Bed,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  UserMinus,
  UserX,
  Edit2,
  Filter,
  ArrowUpRight,
  Shield,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Star,
  Trash2,
  RefreshCw,
  LogOut,
  KeyRound,
  ShieldCheck,
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Check
} from 'lucide-react';
import { useAdmin, AdminRoomItem, AdminMaintenanceItem, AdminUser } from '../../context/AdminContext';
import { apiRequest, uploadImage } from '../../lib/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Coupon, Booking, Review } from '../../types';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const {
    adminUser,
    adminLogout,
    analytics,
    roomInventory,
    toggleRoomAvailability,
    updateRoomPrice,
    maintenanceList,
    updateMaintenanceStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCoupon,
    adminBookings,
    adminCheckIn,
    adminCheckOut,
    adminCancelBooking,
    adminAssignRoom,
    registeredUsers,
    usersLoading,
    updateUserStatus,
    adminReviews,
    deleteReview,
    refreshData
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'inventory' | 'maintenance' | 'coupons' | 'users' | 'reviews' | 'media'>('overview');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Media state
  const [uploadedMedia, setUploadedMedia] = useState<{ filename: string; url: string; size: number; createdAt: string }[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchUploadedMedia = React.useCallback(async () => {
    setMediaLoading(true);
    try {
      const res = await apiRequest<{ uploads: { filename: string; url: string; size: number; createdAt: string }[] }>('/admin/uploads');
      if (res?.uploads) setUploadedMedia(res.uploads);
    } catch (err) {
      console.error('Failed to fetch uploads:', err);
    } finally {
      setMediaLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === 'media') {
      fetchUploadedMedia();
    }
  }, [activeTab, fetchUploadedMedia]);

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMediaUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadImage(files[i]);
      }
      await fetchUploadedMedia();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setMediaUploading(false);
      e.target.value = '';
    }
  };

  // Room Assignment Modal
  const [assignRoomModalBooking, setAssignRoomModalBooking] = useState<Booking | null>(null);
  const [targetRoomNumber, setTargetRoomNumber] = useState('');

  // Cancel Booking Modal
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Cancelled by property manager');

  // Coupon creator modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState(15);
  const [newMaxDiscount, setNewMaxDiscount] = useState(2500);
  const [newMinSpend, setNewMinSpend] = useState(5000);
  const [newDescription, setNewDescription] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleSignOut = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCoupon: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountPercent: newDiscountPercent,
      maxDiscount: newMaxDiscount,
      minSpend: newMinSpend,
      validUntil: '2026-12-31',
      isActive: true,
      description: newDescription || `${newDiscountPercent}% off luxury stays`
    };
    addCoupon(newCoupon);
    setShowCouponModal(false);
    setNewCouponCode('');
  };

  const handleConfirmRoomAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assignRoomModalBooking && targetRoomNumber.trim()) {
      await adminAssignRoom(assignRoomModalBooking.id, targetRoomNumber.trim());
      setAssignRoomModalBooking(null);
      setTargetRoomNumber('');
    }
  };

  const handleConfirmCancellation = async () => {
    if (cancelModalBooking) {
      await adminCancelBooking(cancelModalBooking.id, cancelReason);
      setCancelModalBooking(null);
    }
  };

  const filteredBookings = adminBookings.filter((b) => {
    const matchesFilter = bookingFilter === 'All' || b.bookingStatus === bookingFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestDetails?.firstName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestDetails?.lastName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.hotelName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#1E252B] text-white shrink-0 hidden md:flex flex-col justify-between p-6">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold">
                Stay<span className="text-[#C5A880]">Aura</span>
              </span>
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
              { id: 'bookings', label: 'All Bookings', icon: CalendarCheck, badge: adminBookings.length },
              { id: 'inventory', label: 'Rooms & Rates', icon: Building2 },
              { id: 'maintenance', label: 'Housekeeping', icon: Wrench, badge: maintenanceList.filter((m: AdminMaintenanceItem) => m.status !== 'Clean & Ready').length },
              { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: coupons.length },
              { id: 'users', label: 'User Approval', icon: Users, badge: registeredUsers.filter((u) => u.status === 'pending').length || undefined },
              { id: 'reviews', label: 'Guest Reviews', icon: Star, badge: adminReviews.length },
              { id: 'media', label: 'Media & Uploads', icon: ImageIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A880] text-[#1E252B] font-bold shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#1E252B] text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer Info & Sign out */}
        <div className="pt-6 border-t border-white/10 text-[11px] text-gray-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="truncate">{adminUser?.name || 'Administrator'}</span>
          </div>
          <p className="text-[10px] text-gray-400 truncate">{adminUser?.email || 'admin@stayaura.com'}</p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 text-[#C5A880] font-bold hover:text-white transition-colors text-xs py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to guest site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header Strip */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#EAE6DF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A880]">
                StayAura Central Console
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                Live Database Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Signed in as <strong className="text-gray-900">{adminUser?.email || 'admin@stayaura.com'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C5A880] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {['overview', 'bookings', 'inventory', 'maintenance', 'coupons', 'users', 'reviews', 'media'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap ${
                activeTab === tab ? 'bg-[#1E252B] text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW & KPIS TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Live Property Operations
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Executive Analytics Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Real-time booking volumes, occupancy ratios, front-desk movements, and revenue metrics directly from the database.
              </p>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real Database Ledger</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Reservations</span>
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
                <p className="text-[11px] text-gray-500 mt-2">
                  Across all verified properties
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Today's Check-ins</span>
                  <UserCheck className="w-4 h-4 text-[#C5A880]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.todayCheckIns}</p>
                <p className="text-[11px] text-gray-500 mt-2">
                  {analytics.todayCheckOuts} check-outs scheduled
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE6DF] shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Occupancy Rate</span>
                  <Bed className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.occupancyRate}%</p>
                <div className="w-full h-1.5 rounded-full bg-gray-100 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${Math.min(100, analytics.occupancyRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Analytics / Revenue Trends */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">
                    Monthly Revenue & Occupancy Pace
                  </h3>
                  <p className="text-xs text-gray-500">
                    Live booking volume and seasonal yield curve
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800">
                  Target: 85% Occupancy Achieved
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 pt-6 border-b border-gray-100">
                {[
                  { month: 'Apr', val: 65, rev: '₹14.2L' },
                  { month: 'May', val: 72, rev: '₹18.5L' },
                  { month: 'Jun', val: 80, rev: '₹22.1L' },
                  { month: 'Jul', val: 84, rev: '₹25.8L' },
                  { month: 'Aug', val: 88, rev: '₹28.4L' },
                  { month: 'Oct (Now)', val: 92, rev: `₹${Math.round(analytics.totalRevenue / 100000)}L` }
                ].map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                      {item.rev}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#1E252B] to-[#C5A880] rounded-xl group-hover:brightness-110 transition-all cursor-pointer"
                      style={{ height: `${item.val}%` }}
                    />
                    <span className="text-xs font-semibold text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings Snapshot */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE6DF] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">
                    Latest Guest Reservations
                  </h3>
                  <p className="text-xs text-gray-500">
                    Most recently submitted guest orders and confirmation receipts.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#C5A880] hover:text-[#977341] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Bookings ({adminBookings.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Ref ID</th>
                      <th className="pb-3">Primary Guest</th>
                      <th className="pb-3">Hotel & Room</th>
                      <th className="pb-3">Stay Dates</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminBookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-gray-900">#{b.id}</td>
                        <td className="py-3.5">
                          <p className="font-bold text-gray-900">
                            {b.guestDetails?.firstName} {b.guestDetails?.lastName}
                          </p>
                          <p className="text-[10px] text-gray-500">{b.guestDetails?.phone}</p>
                        </td>
                        <td className="py-3.5">
                          <p className="font-medium text-gray-900">{b.hotelName}</p>
                          <p className="text-[10px] text-gray-500">{b.roomName}</p>
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {b.checkIn} → {b.checkOut}
                        </td>
                        <td className="py-3.5 font-bold text-gray-900">
                          ₹{b.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={b.bookingStatus} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKINGS MANAGEMENT TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Guest Ledger
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Reservations & Guest Stays ({adminBookings.length})
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Filter by booking state, assign room keys, process manual cancellations, or update check-in movements.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['All', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      bookingFilter === status
                        ? 'bg-[#1E252B] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search guest, ID, hotel..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Guest Details</th>
                      <th className="py-3 px-4">Property & Room</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          No reservations match your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                            #{b.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900">
                              {b.guestDetails?.firstName} {b.guestDetails?.lastName}
                            </p>
                            <p className="text-[10px] text-gray-400">{b.guestDetails?.email}</p>
                            <p className="text-[10px] text-gray-400">{b.guestDetails?.phone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-gray-900">{b.hotelName}</p>
                            <p className="text-[11px] text-gray-500">{b.roomName}</p>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            <p className="font-semibold text-gray-800">{b.checkIn} → {b.checkOut}</p>
                            <p className="text-[10px] text-gray-400">{b.nights} nights ({b.adultsCount} adults)</p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#977341]">
                            {b.assignedRoomNumber ? (
                              <span className="px-2 py-1 rounded bg-[#FAF5EB] text-[#977341] border border-[#E9D8B4]">
                                Room {b.assignedRoomNumber}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignRoomModalBooking(b);
                                  setTargetRoomNumber(b.assignedRoomNumber || '');
                                }}
                                className="text-[10px] text-blue-600 hover:underline font-semibold"
                              >
                                + Assign Room
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900">₹{b.grandTotal.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] text-emerald-700">{b.paymentStatus}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={b.bookingStatus} size="sm" />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.bookingStatus === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => adminCheckIn(b.id, b.assignedRoomNumber || '101')}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] transition-colors"
                                >
                                  Check In
                                </button>
                              )}
                              {b.bookingStatus === 'Checked In' && (
                                <button
                                  type="button"
                                  onClick={() => adminCheckOut(b.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] transition-colors"
                                >
                                  Check Out
                                </button>
                              )}
                              {b.bookingStatus === 'Confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => setCancelModalBooking(b)}
                                  className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[10px] transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ROOMS & INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Live Inventory Allocation
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Room Types & Dynamic Pricing
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Toggle room availability (In Stock / Sold Out) and fine-tune night rates live across all properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomInventory.map((item: AdminRoomItem) => (
                <div
                  key={item.roomId}
                  className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {item.hotelName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-gray-900">{item.roomName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Total Allocation: {item.totalRooms} Rooms</p>

                    <div className="mt-4 p-3 rounded-2xl bg-[#FAF9F6] border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Price / Night</span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.pricePerNight.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateRoomPrice(item.roomId, Math.max(1000, item.pricePerNight - 500))}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-xs hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRoomPrice(item.roomId, item.pricePerNight + 500)}
                          className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-xs hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Live Inventory State</span>
                    <button
                      type="button"
                      onClick={() => toggleRoomAvailability(item.roomId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item.isAvailable
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isAvailable ? 'Mark Sold Out' : 'Enable Availability'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. HOUSEKEEPING & MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Housekeeping & Sanitation
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Room Readiness & Sanitization Ledger
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Real-time room turnover status, turn-down logs, and maintenance ticket tracking.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Turnover Status</th>
                      <th className="py-3 px-4">Inspection Notes</th>
                      <th className="py-3 px-4">Last Inspected</th>
                      <th className="py-3 px-4 text-right">Housekeeping Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {maintenanceList.map((item: AdminMaintenanceItem) => (
                      <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900 font-mono text-sm">
                          Suite {item.roomNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{item.hotelName}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              item.status === 'Clean & Ready'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.status === 'Cleaning in Progress'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {item.status === 'Clean & Ready' && <CheckCircle2 className="w-3 h-3" />}
                            {item.status === 'Cleaning in Progress' && <Clock className="w-3 h-3" />}
                            {item.status === 'Maintenance Required' && <AlertTriangle className="w-3 h-3" />}
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 max-w-xs">{item.notes}</td>
                        <td className="py-3.5 px-4 text-gray-400">{item.lastCleaned}</td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={item.status}
                            onChange={(e) => updateMaintenanceStatus(item.id, e.target.value as AdminMaintenanceItem['status'])}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[11px] font-bold text-gray-700 cursor-pointer"
                          >
                            <option value="Clean & Ready">Clean & Ready</option>
                            <option value="Cleaning in Progress">Cleaning in Progress</option>
                            <option value="Maintenance Required">Maintenance Required</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. COUPONS & PROMOS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                  Marketing & Yield
                </span>
                <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                  Promotional Coupons & Vouchers
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Active discounts applied across checkout bookings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCouponModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C5A880]" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c: Coupon) => (
                <div
                  key={c.code}
                  className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-base font-bold text-gray-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-[#977341]">
                        {c.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.active ?? c.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.active ?? c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-800">
                      {c.discountPercent ? `${c.discountPercent}% Off` : `₹${c.discountValue} Off`}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.description}</p>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
                      <p>Min Spend: ₹{(c.minSpend || c.minBookingValue || 0).toLocaleString('en-IN')}</p>
                      <p>Max Discount: ₹{(c.maxDiscount || 0).toLocaleString('en-IN')}</p>
                      <p>Valid Until: {c.validUntil}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleCoupon(c.code)}
                      className={`text-xs font-bold hover:underline cursor-pointer ${
                        c.active ?? c.isActive ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {c.active ?? c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.code)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Access Control & Security
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Registered Guest Accounts ({registeredUsers.length})
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Approve, reject, or manage role permissions for user accounts registered via the StayAura portal.
              </p>
            </div>

            {usersLoading ? (
              <div className="bg-white rounded-3xl border border-[#EAE6DF] p-10 text-center text-sm text-gray-500">
                Loading users from database...
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">User ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Registered</th>
                        <th className="py-3 px-4">Approval Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registeredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                            No registered users found.
                          </td>
                        </tr>
                      ) : (
                        registeredUsers.map((u: AdminUser) => (
                          <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500 max-w-[100px] truncate">
                              {u.id.slice(0, 16)}…
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">{u.name}</td>
                            <td className="py-3.5 px-4 text-gray-600">{u.email}</td>
                            <td className="py-3.5 px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                                {u.role === 'admin' ? 'Admin' : 'Customer'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-gray-500">{u.registeredAt || '—'}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                  u.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : u.status === 'rejected'
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {u.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                {u.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                {u.status === 'pending' && <Clock className="w-3 h-3" />}
                                {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {u.status !== 'approved' && (
                                  <button
                                    type="button"
                                    onClick={() => updateUserStatus(u.id, 'approved')}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] transition-colors cursor-pointer"
                                  >
                                    <UserCheck className="w-3 h-3" /> Approve
                                  </button>
                                )}
                                {u.status !== 'rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => updateUserStatus(u.id, 'rejected')}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[10px] transition-colors cursor-pointer"
                                  >
                                    <UserX className="w-3 h-3" /> Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. REVIEWS & RATINGS MODERATION TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Hospitality Feedback
              </span>
              <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                Guest Reviews & Experience Ratings ({adminReviews.length})
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Moderate published feedback, view verified guest scores, and remove inappropriate entries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminReviews.length === 0 ? (
                <div className="col-span-2 bg-white rounded-3xl border border-[#EAE6DF] p-10 text-center text-sm text-gray-500">
                  No guest reviews submitted yet.
                </div>
              ) : (
                adminReviews.map((rev: Review) => (
                  <div key={rev.id} className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(rev.overallRating || rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                            />
                          ))}
                          <span className="ml-1.5 text-xs font-bold text-gray-900">
                            {rev.overallRating || rev.rating || 5}.0
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>

                      <h4 className="font-bold text-sm text-gray-900">{rev.title || 'Guest Review'}</h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">"{rev.comment}"</p>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <div>
                          <span className="font-semibold text-gray-800">{rev.guestName || rev.userName || 'Verified Guest'}</span>
                          <span className="text-gray-400"> • {rev.guestCity || rev.userLocation || 'India'}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{rev.roomType || 'Deluxe'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => deleteReview(rev.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Review</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 8. MEDIA & UPLOADS TAB */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                  Digital Asset Storage
                </span>
                <h1 className="font-display text-3xl font-bold text-gray-900 mt-0.5">
                  Local Photo & Media Library
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Upload local hotel images, room photos, and promotional banners stored directly on your server.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] transition-colors cursor-pointer shadow-sm">
                <UploadCloud className="w-4 h-4 text-[#C5A880]" />
                <span>{mediaUploading ? 'Uploading...' : 'Upload Photos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleMediaFileUpload}
                  disabled={mediaUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Dropzone visual */}
            <label className="block border-2 border-dashed border-[#EAE6DF] hover:border-[#C5A880] rounded-3xl p-8 text-center bg-white cursor-pointer transition-colors">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#FAF5EB] text-[#977341] flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-900">
                Click or drag photos here to upload to server storage
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Supports JPEG, PNG, WebP up to 10MB per file
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleMediaFileUpload}
                disabled={mediaUploading}
                className="hidden"
              />
            </label>

            {/* Media Grid */}
            {mediaLoading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE6DF]">
                <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">Loading stored media assets...</p>
              </div>
            ) : uploadedMedia.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE6DF]">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-gray-800">No media uploaded yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Upload local photos to use them for hotel hero images, room types, or promotional campaigns.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedMedia.map((m) => (
                  <div key={m.filename} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs group">
                    <div className="relative h-36 bg-gray-100">
                      <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          setCopiedUrl(m.url);
                          setTimeout(() => setCopiedUrl(null), 2000);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition"
                        title="Copy relative URL"
                      >
                        {copiedUrl === m.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-mono font-bold text-gray-800 truncate" title={m.filename}>
                        {m.filename}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                        <span>{(m.size / 1024).toFixed(1)} KB</span>
                        <span className="font-semibold text-[#977341]">{copiedUrl === m.url ? 'Copied!' : 'Copy Link'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Assign Room Number Modal */}
      {assignRoomModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-1">
              Assign Room Key
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Booking Ref: <strong>#{assignRoomModalBooking.id}</strong> ({assignRoomModalBooking.guestDetails?.firstName} {assignRoomModalBooking.guestDetails?.lastName})
            </p>

            <form onSubmit={handleConfirmRoomAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Room / Suite Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 304, 401, Villa A"
                  value={targetRoomNumber}
                  onChange={(e) => setTargetRoomNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAssignRoomModalBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] cursor-pointer"
                >
                  Assign Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-display text-xl font-bold text-gray-900">
              Cancel Reservation #{cancelModalBooking.id}?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Guest: {cancelModalBooking.guestDetails?.firstName} {cancelModalBooking.guestDetails?.lastName} at {cancelModalBooking.hotelName}
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Cancellation Reason</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-1">
              Create Promotional Coupon
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Add a new promotional voucher code for guests to redeem during checkout.
            </p>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={70}
                    value={newDiscountPercent}
                    onChange={(e) => setNewDiscountPercent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    step={100}
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Min Spend Required (₹)</label>
                <input
                  type="number"
                  step={500}
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Special festival luxury discount"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E252B] text-white text-xs font-bold hover:bg-[#2D3748] cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
