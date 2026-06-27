// app/preorders/PreordersClient.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Chip,
  Checkbox,
  Select,
  ListBox,
  Pagination,
} from "@heroui/react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Filter,
  Check,
  X,
} from "lucide-react";
import { toggleStatusAction, deletePreorderAction } from "@/lib/actions/preorders";

const sortOptions = [
  { key: "name", label: "Name" },
  { key: "createdAt", label: "Created At" },
  { key: "startsAt", label: "Starts At" },
  { key: "endsAt", label: "Ends At" },
];

const statusOptions = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

function StatusToggle({ isSelected, onChange, isDisabled }) {
  return (
    <button
      onClick={() => !isDisabled && onChange()}
      disabled={isDisabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${isSelected
          ? "bg-gradient-to-r from-sky-500 to-blue-500 shadow-lg shadow-sky-500/30"
          : "bg-gray-300"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${isSelected ? "translate-x-6" : "translate-x-1"
          }`}
      >
        {isSelected ? (
          <Check className="h-3 w-3 text-sky-600" />
        ) : (
          <X className="h-3 w-3 text-gray-500" />
        )}
      </span>
    </button>
  );
}

// Custom Checkbox component using HeroUI v3 API
function CustomCheckbox({ isSelected, onChange, isIndeterminate }) {
  return (
    <Checkbox
      isSelected={isSelected}
      onChange={onChange}
      isIndeterminate={isIndeterminate}
      className="flex-shrink-0"
    >
      <Checkbox.Content>
        <Checkbox.Control className="w-4 h-4 rounded border-2 border-gray-300 data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-sky-600 data-[selected=true]:to-blue-600 data-[selected=true]:border-sky-600 data-[indeterminate=true]:bg-gradient-to-r data-[indeterminate=true]:from-sky-600 data-[indeterminate=true]:to-blue-600 data-[indeterminate=true]:border-sky-600">
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox.Content>
    </Checkbox>
  );
}

export default function PreordersClient({
  initialPreorders = [],
  total,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  filter = {},
}) {
  const router = useRouter();

  // ========== UI STATE ==========
  const [preorders, setPreorders] = useState(initialPreorders);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(null);
  const [status, setStatus] = useState(filter.status || "all");
  const [sortBy, setSortBy] = useState(filter.sortBy || "name");
  const [sortOrder, setSortOrder] = useState(filter.order || "asc");
  const [page, setPage] = useState(initialCurrentPage || parseInt(filter.page) || 1);
  const limit = parseInt(filter.limit) || 8;
  const totalPages = initialTotalPages || Math.ceil(total / limit);

  // Track previous filter values to detect when filter actually changes
  const prevStatusRef = useRef(status);
  const prevSortByRef = useRef(sortBy);
  const prevSortOrderRef = useRef(sortOrder);

  // ========== PAGINATION ==========
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // ========== UPDATE PREORDERS WHEN PROPS CHANGE ==========
  useEffect(() => {
    setPreorders(initialPreorders);
    setSelectedKeys(new Set());
  }, [initialPreorders]);

  // ========== UPDATE URL ON FILTER CHANGE ==========
  useEffect(() => {
    const sp = new URLSearchParams();
    if (status !== "all") sp.set("status", status);
    if (sortBy) sp.set("sortBy", sortBy);
    if (sortOrder) sp.set("order", sortOrder);
    if (page > 1) sp.set("page", String(page));
    if (limit !== 8) sp.set("limit", String(limit));

    const queryString = sp.toString();
    const currentUrl = window.location.search;

    if (`?${queryString}` !== currentUrl) {
      router.push(`?${queryString}`);
    }
  }, [status, sortBy, sortOrder, page, limit, router]);

  // ========== RESET PAGE ONLY WHEN FILTER CHANGES ==========
  useEffect(() => {
    const statusChanged = prevStatusRef.current !== status;
    const sortByChanged = prevSortByRef.current !== sortBy;
    const sortOrderChanged = prevSortOrderRef.current !== sortOrder;

    if (statusChanged || sortByChanged || sortOrderChanged) {
      setPage(1);
    }

    prevStatusRef.current = status;
    prevSortByRef.current = sortBy;
    prevSortOrderRef.current = sortOrder;
  }, [status, sortBy, sortOrder]);

  // ========== CHECKBOX HANDLERS ==========
  const handleSelectAll = (checked) => {
    if (checked) {
      const visibleIds = preorders.map((item) => String(item.id));
      setSelectedKeys(new Set(visibleIds));
    } else {
      setSelectedKeys(new Set());
    }
  };

  const handleSelectRow = (id, checked) => {
    const stringId = String(id);
    const next = new Set(selectedKeys);
    if (checked) {
      next.add(stringId);
    } else {
      next.delete(stringId);
    }
    setSelectedKeys(next);
  };

  const isAllSelected = preorders.length > 0 &&
    preorders.every((item) => selectedKeys.has(String(item.id)));

  const isSomeSelected = preorders.length > 0 &&
    preorders.some((item) => selectedKeys.has(String(item.id))) &&
    !isAllSelected;

  const selectedCount = selectedKeys.size;

  // ========== HANDLERS ==========
  const handleFilterChange = (value) => {
    setStatus(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleToggleStatus = async (id) => {
    setIsUpdating(id);
    try {
      const result = await toggleStatusAction(id);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to toggle status:", result.error);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this preorder?")) return;

    try {
      const result = await deletePreorderAction(id);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to delete preorder:", result.error);
      }
    } catch (error) {
      console.error("Error deleting preorder:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/30 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Preorders</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your preorder listings</p>
          </div>
          <Button
            className="bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all rounded-full px-6 py-2.5 font-medium"
          >
            <Link href="/preorders/create" className="flex items-center gap-2">
              <Plus size={18} />
              Create Preorder
            </Link>
          </Button>
        </div>

        {/* Selection Info Bar */}
        {selectedCount > 0 && (
          <div className="mb-4 px-4 py-2 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-700 flex items-center gap-2">
            <span>
              {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
            </span>
            <button
              onClick={() => setSelectedKeys(new Set())}
              className="ml-auto text-sky-600 hover:text-sky-800 font-medium text-xs"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 p-3 md:p-4 bg-gradient-to-r from-sky-50/50 to-blue-50/50 rounded-xl border border-sky-100/30">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-sky-500" />
            <span className="text-sm font-medium text-sky-600">Status:</span>
          </div>

          <Select
            className="w-[130px]"
            value={status}
            onChange={handleFilterChange}
            size="sm"
          >
            <Select.Trigger className="bg-white/70 border border-sky-200/50 rounded-lg h-8 text-sm text-gray-700">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {statusOptions.map((opt) => (
                  <ListBox.Item key={opt.key} id={opt.key} textValue={opt.label}>
                    {opt.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <div className="flex-1" />

          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-sm font-medium text-sky-600 whitespace-nowrap">Sort by:</span>

            <Select
              className="w-[130px]"
              value={sortBy}
              onChange={handleSortChange}
              size="sm"
            >
              <Select.Trigger className="bg-white/70 border border-sky-200/50 rounded-lg h-8 text-sm text-gray-700">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {sortOptions.map((opt) => (
                    <ListBox.Item key={opt.key} id={opt.key} textValue={opt.label}>
                      {opt.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <button
              onClick={handleOrderToggle}
              className="hover:bg-sky-50/50 w-8 h-8 rounded-full bg-white/70 border border-sky-200/50 flex items-center justify-center transition-colors"
            >
              {sortOrder === "asc" ? (
                <ArrowUp size={14} className="text-sky-600" />
              ) : (
                <ArrowDown size={14} className="text-sky-600" />
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-sky-100/50 rounded-xl shadow-sm shadow-sky-100/20 bg-white/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-sky-50/60 to-blue-50/60 border-b border-sky-100/50">
                <th className="w-10 px-2 md:px-4 py-3">
                  <CustomCheckbox
                    isSelected={isAllSelected}
                    isIndeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase">Name</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase hidden sm:table-cell">Products</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase hidden lg:table-cell">Preorder when</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase hidden md:table-cell">Starts at</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase hidden lg:table-cell">Ends at</th>
                <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase">Status</th>
                <th className="px-2 md:px-4 py-3 text-center font-semibold text-gray-700 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50/50">
              {preorders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={40} className="text-sky-300" />
                      <span className="text-lg font-medium">No preorders found</span>
                      <span className="text-sm">Try adjusting your filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                preorders.map((item) => {
                  const isSelected = selectedKeys.has(String(item.id));
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gradient-to-r hover:from-sky-50/30 hover:to-blue-50/30 transition group ${isSelected ? 'bg-sky-50/50' : ''
                        }`}
                    >
                      <td className="px-2 md:px-4 py-3">
                        <CustomCheckbox
                          isSelected={isSelected}
                          onChange={(checked) => handleSelectRow(item.id, checked)}
                        />
                      </td>
                      <td className="px-2 md:px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-2 md:px-4 py-3 text-gray-600 hidden sm:table-cell">{item.products}</td>
                      <td className="px-2 md:px-4 py-3 text-gray-600 hidden lg:table-cell">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${item.preorderWhen === "out-of-stock"
                              ? "bg-red-50 text-red-600"
                              : "bg-sky-50 text-sky-600"
                            }`}
                        >
                          {item.preorderWhen}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-3 text-gray-600 hidden md:table-cell">{item.startsAt}</td>
                      <td className="px-2 md:px-4 py-3 text-gray-600 hidden lg:table-cell">{item.endsAt || "—"}</td>
                      <td className="px-2 md:px-4 py-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Chip
                            size="sm"
                            variant="flat"
                            className={`${item.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                : "bg-gray-50 text-gray-600 border border-gray-200/50"
                              } font-medium hidden sm:inline-flex`}
                            startContent={
                              <span
                                className={`w-2 h-2 rounded-full ${item.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                                  }`}
                              />
                            }
                          >
                            {item.status === "active" ? "Active" : "Inactive"}
                          </Chip>
                          <StatusToggle
                            isSelected={item.status === "active"}
                            onChange={() => handleToggleStatus(item.id)}
                            isDisabled={isUpdating === item.id}
                          />
                        </div>
                      </td>
                      <td className="px-2 md:px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/preorders/${item.id}/edit`}>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="hover:bg-sky-50/50 min-w-8 w-8 h-8 rounded-full opacity-70 group-hover:opacity-100 transition"
                            >
                              <Pencil size={14} className="text-gray-500" />
                            </Button>
                          </Link>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleDelete(item.id)}
                            className="hover:bg-red-50/50 min-w-8 w-8 h-8 rounded-full opacity-70 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ========== PAGINATION ========== */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination className="w-full">
              <Pagination.Summary>
                Showing {startItem}–{endItem} of {total} results
              </Pagination.Summary>
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => p - 1)}
                  >
                    <Pagination.PreviousIcon />
                    <span>Previous</span>
                  </Pagination.Previous>
                </Pagination.Item>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === totalPages}
                    onPress={() => setPage((p) => p + 1)}
                  >
                    <span>Next</span>
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}