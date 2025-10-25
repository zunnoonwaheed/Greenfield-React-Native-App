import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

const GroceryFilterModal = ({ visible, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    priceRange: '',
    sortBy: '',
    discount: '',
    rating: '',
    delivery: '',
    brand: '',
    packaging: '',
  });

  const FilterSection = ({ title, placeholder, icon, value, onPress }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{title}</Text>
      <TouchableOpacity style={styles.filterInput} onPress={onPress}>
        <View style={styles.inputContainer}>
          {icon}
          <Text style={[styles.inputText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
        </View>
        <DropdownIcon />
      </TouchableOpacity>
    </View>
  );

  const DollarIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 1.66663V18.3333M14.1667 4.16663H7.91667C7.14312 4.16663 6.40125 4.47392 5.85427 5.0209C5.30729 5.56788 5 6.30974 5 7.08329C5 7.85684 5.30729 8.59871 5.85427 9.14569C6.40125 9.69267 7.14312 9.99996 7.91667 9.99996H12.0833C12.8569 9.99996 13.5987 10.3073 14.1457 10.8542C14.6927 11.4012 15 12.1431 15 12.9166C15 13.6902 14.6927 14.432 14.1457 14.979C13.5987 15.526 12.8569 15.8333 12.0833 15.8333H5"
        stroke="#1E293B"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const SortIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 8L7 4M7 4L11 8M7 4V20M11 12H15M11 16H18M11 20H21"
        stroke="#334155"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const PercentIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M15.8334 4.16671L4.16671 15.8334M7.50004 5.41671C7.50004 6.5673 6.5673 7.50004 5.41671 7.50004C4.26611 7.50004 3.33337 6.5673 3.33337 5.41671C3.33337 4.26611 4.26611 3.33337 5.41671 3.33337C6.5673 3.33337 7.50004 4.26611 7.50004 5.41671ZM16.6667 14.5834C16.6667 15.734 15.734 16.6667 14.5834 16.6667C13.4328 16.6667 12.5 15.734 12.5 14.5834C12.5 13.4328 13.4328 12.5 14.5834 12.5C15.734 12.5 16.6667 13.4328 16.6667 14.5834Z"
        stroke="#334155"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const StarIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M9.60404 1.91249C9.64056 1.83871 9.69697 1.7766 9.76692 1.73318C9.83686 1.68976 9.91755 1.66675 9.99987 1.66675C10.0822 1.66675 10.1629 1.68976 10.2328 1.73318C10.3028 1.7766 10.3592 1.83871 10.3957 1.91249L12.3207 5.81166C12.4475 6.0683 12.6347 6.29033 12.8662 6.4587C13.0977 6.62708 13.3666 6.73675 13.6499 6.77833L17.9549 7.40833C18.0364 7.42015 18.1131 7.45455 18.1761 7.50766C18.2391 7.56077 18.2861 7.63045 18.3116 7.70883C18.337 7.78721 18.3401 7.87117 18.3204 7.95119C18.3006 8.03121 18.2589 8.10412 18.1999 8.16166L15.0865 11.1933C14.8812 11.3934 14.7276 11.6404 14.6389 11.913C14.5502 12.1856 14.5291 12.4757 14.5774 12.7583L15.3124 17.0417C15.3268 17.1232 15.318 17.2071 15.287 17.2839C15.2559 17.3607 15.204 17.4272 15.137 17.4758C15.07 17.5245 14.9907 17.5533 14.9081 17.5591C14.8255 17.5648 14.743 17.5472 14.6699 17.5083L10.8215 15.485C10.568 15.3518 10.2859 15.2823 9.99946 15.2823C9.71306 15.2823 9.43094 15.3518 9.17737 15.485L5.32987 17.5083C5.25681 17.547 5.17437 17.5644 5.09191 17.5585C5.00946 17.5527 4.9303 17.5238 4.86345 17.4752C4.7966 17.4266 4.74473 17.3602 4.71375 17.2835C4.68277 17.2069 4.67392 17.1231 4.68821 17.0417L5.42237 12.7592C5.47087 12.4764 5.44986 12.1862 5.36115 11.9134C5.27245 11.6406 5.11871 11.3935 4.91321 11.1933L1.79987 8.16249C1.74037 8.10502 1.6982 8.03199 1.67817 7.95172C1.65815 7.87145 1.66107 7.78717 1.6866 7.70849C1.71214 7.6298 1.75926 7.55986 1.8226 7.50665C1.88594 7.45343 1.96296 7.41908 2.04487 7.40749L6.34904 6.77833C6.63259 6.73708 6.90186 6.62754 7.13369 6.45915C7.36552 6.29076 7.55296 6.06855 7.67987 5.81166L9.60404 1.91249Z"
        stroke="#334155"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const PackageIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M13.3333 13.3334L15 15.0001L18.3333 11.6667M17.5 8.33341V6.66675C17.4997 6.37448 17.4225 6.08742 17.2763 5.83438C17.13 5.58134 16.9198 5.37122 16.6667 5.22508L10.8333 1.89175C10.58 1.74547 10.2926 1.66846 10 1.66846C9.70744 1.66846 9.42003 1.74547 9.16667 1.89175L3.33333 5.22508C3.08022 5.37122 2.86998 5.58134 2.72372 5.83438C2.57745 6.08742 2.5003 6.37448 2.5 6.66675V13.3334C2.5003 13.6257 2.57745 13.9127 2.72372 14.1658C2.86998 14.4188 3.08022 14.6289 3.33333 14.7751L9.16667 18.1084C9.42003 18.2547 9.70744 18.3317 10 18.3317C10.2926 18.3317 10.58 18.2547 10.8333 18.1084L12.5 17.1584M6.25 3.55841L13.75 7.85008M2.74167 5.83341L10 10.0001M10 10.0001L17.2583 5.83341M10 10.0001V18.3334"
        stroke="#334155"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const TagIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G clipPath="url(#clip0_21_1241)">
        <Path
          d="M8.74996 5.83342C8.98008 5.83342 9.16663 5.64687 9.16663 5.41675C9.16663 5.18663 8.98008 5.00008 8.74996 5.00008C8.51984 5.00008 8.33329 5.18663 8.33329 5.41675C8.33329 5.64687 8.51984 5.83342 8.74996 5.83342Z"
          fill="#1E293B"
        />
        <Path
          d="M1.66663 5.83341V10.9767C1.66672 11.4187 1.84238 11.8426 2.15496 12.1551L7.74663 17.7467C8.09272 18.0955 8.55509 18.3047 9.04553 18.3343C9.53598 18.364 10.0202 18.2121 10.4058 17.9076M10.9766 1.66675C11.4186 1.66684 11.8425 1.8425 12.155 2.15508L17.7466 7.74675C17.9341 7.93267 18.0829 8.15388 18.1844 8.39759C18.2859 8.64131 18.3382 8.90272 18.3382 9.16675C18.3382 9.43077 18.2859 9.69218 18.1844 9.9359C18.0829 10.1796 17.9341 10.4008 17.7466 10.5867L13.92 14.4134C13.734 14.6009 13.5128 14.7497 13.2691 14.8512C13.0254 14.9527 12.764 15.005 12.5 15.005C12.2359 15.005 11.9745 14.9527 11.7308 14.8512C11.4871 14.7497 11.2659 14.6009 11.08 14.4134L5.48829 8.82175C5.17571 8.50926 5.00005 8.08541 4.99996 7.64341V2.50008C4.99996 2.27907 5.08776 2.06711 5.24404 1.91083C5.40032 1.75455 5.61228 1.66675 5.83329 1.66675H10.9766ZM9.16663 5.41675C9.16663 5.64687 8.98008 5.83341 8.74996 5.83341C8.51984 5.83341 8.33329 5.64687 8.33329 5.41675C8.33329 5.18663 8.51984 5.00008 8.74996 5.00008C8.98008 5.00008 9.16663 5.18663 9.16663 5.41675Z"
          stroke="#1E293B"
          strokeWidth={1.66667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_21_1241">
          <Rect width={20} height={20} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );

  const SimplePackageIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 18.3334V10.0001M10 10.0001L2.74167 5.83341M10 10.0001L17.2583 5.83341M6.25 3.55841L13.75 7.85008M9.16667 18.1084C9.42003 18.2547 9.70744 18.3317 10 18.3317C10.2926 18.3317 10.58 18.2547 10.8333 18.1084L16.6667 14.7751C16.9198 14.6289 17.13 14.4188 17.2763 14.1658C17.4225 13.9127 17.4997 13.6257 17.5 13.3334V6.66675C17.4997 6.37448 17.4225 6.08742 17.2763 5.83438C17.13 5.58134 16.9198 5.37122 16.6667 5.22508L10.8333 1.89175C10.58 1.74547 10.2926 1.66846 10 1.66846C9.70744 1.66846 9.42003 1.74547 9.16667 1.89175L3.33333 5.22508C3.08022 5.37122 2.86998 5.58134 2.72372 5.83438C2.57745 6.08742 2.5003 6.37448 2.5 6.66675V13.3334C2.5003 13.6257 2.57745 13.9127 2.72372 14.1658C2.86998 14.4188 3.08022 14.6289 3.33333 14.7751L9.16667 18.1084Z"
        stroke="#334155"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const DropdownIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M14.1666 7.64162C14.0104 7.48641 13.7992 7.39929 13.5791 7.39929C13.3589 7.39929 13.1477 7.48641 12.9916 7.64162L9.99992 10.5916L7.04992 7.64162C6.89378 7.48641 6.68257 7.39929 6.46242 7.39929C6.24226 7.39929 6.03105 7.48641 5.87492 7.64162C5.79681 7.71909 5.73481 7.81126 5.69251 7.91281C5.6502 8.01435 5.62842 8.12328 5.62842 8.23329C5.62842 8.3433 5.6502 8.45222 5.69251 8.55377C5.73481 8.65532 5.79681 8.74748 5.87492 8.82495L9.40825 12.3583C9.48572 12.4364 9.57789 12.4984 9.67944 12.5407C9.78098 12.583 9.88991 12.6048 9.99992 12.6048C10.1099 12.6048 10.2188 12.583 10.3204 12.5407C10.4219 12.4984 10.5141 12.4364 10.5916 12.3583L14.1666 8.82495C14.2447 8.74748 14.3067 8.65532 14.349 8.55377C14.3913 8.45222 14.4131 8.3433 14.4131 8.23329C14.4131 8.12328 14.3913 8.01435 14.349 7.91281C14.3067 7.81126 14.2447 7.71909 14.1666 7.64162Z"
        fill="#0F172A"
      />
    </Svg>
  );

  const CloseIcon = () => (
    <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
      <Path
        d="M10.4042 7.99909L16.7042 1.70909C16.8925 1.52078 16.9983 1.26539 16.9983 0.999087C16.9983 0.732785 16.8925 0.477391 16.7042 0.289087C16.5159 0.100783 16.2605 -0.00500488 15.9942 -0.00500488C15.7279 -0.00500488 15.4725 0.100783 15.2842 0.289087L8.9942 6.58909L2.7042 0.289087C2.5159 0.100783 2.2605 -0.00500465 1.9942 -0.00500464C1.7279 -0.00500464 1.47251 0.100783 1.2842 0.289087C1.0959 0.477391 0.99011 0.732785 0.99011 0.999087C0.99011 1.26539 1.0959 1.52078 1.2842 1.70909L7.5842 7.99909L1.2842 14.2891C1.19047 14.3821 1.11608 14.4927 1.06531 14.6145C1.01454 14.7364 0.988403 14.8671 0.988403 14.9991C0.988403 15.1311 1.01454 15.2618 1.06531 15.3837C1.11608 15.5055 1.19047 15.6161 1.2842 15.7091C1.37716 15.8028 1.48777 15.8772 1.60962 15.928C1.73148 15.9787 1.86219 16.0049 1.9942 16.0049C2.12621 16.0049 2.25692 15.9787 2.37878 15.928C2.50064 15.8772 2.61124 15.8028 2.7042 15.7091L8.9942 9.40909L15.2842 15.7091C15.3772 15.8028 15.4878 15.8772 15.6096 15.928C15.7315 15.9787 15.8622 16.0049 15.9942 16.0049C16.1262 16.0049 16.2569 15.9787 16.3788 15.928C16.5006 15.8772 16.6112 15.8028 16.7042 15.7091C16.7979 15.6161 16.8723 15.5055 16.9231 15.3837C16.9739 15.2618 17 15.1311 17 14.9991C17 14.8671 16.9739 14.7364 16.9231 14.6145C16.8723 14.4927 16.7979 14.3821 16.7042 14.2891L10.4042 7.99909Z"
        fill="#0F172A"
      />
    </Svg>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Apply Search Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <FilterSection
              title="Price Range"
              placeholder="Enter budget (USD)"
              icon={<DollarIcon />}
              value={filters.priceRange}
              onPress={() => {}}
            />

            <FilterSection
              title="Sort By"
              placeholder="e.g. Price (Low to High / High to Low)"
              icon={<SortIcon />}
              value={filters.sortBy}
              onPress={() => {}}
            />

            <FilterSection
              title="Discount / Offers"
              placeholder="e.g. Show items on discount"
              icon={<PercentIcon />}
              value={filters.discount}
              onPress={() => {}}
            />

            <FilterSection
              title="Ratings & Reviews"
              placeholder="e.g. 4★ & above"
              icon={<StarIcon />}
              value={filters.rating}
              onPress={() => {}}
            />

            <FilterSection
              title="Delivery / Pickup"
              placeholder="e.g. Free delivery"
              icon={<PackageIcon />}
              value={filters.delivery}
              onPress={() => {}}
            />

            <FilterSection
              title="Brand / Seller"
              placeholder="e.g. Select by seller or brand name"
              icon={<TagIcon />}
              value={filters.brand}
              onPress={() => {}}
            />

            <FilterSection
              title="Packaging / Quantity"
              placeholder="e.g. Single item"
              icon={<SimplePackageIcon />}
              value={filters.packaging}
              onPress={() => {}}
            />
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    marginTop: 200,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 31,
    paddingTop: 28,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'DM Sans',
  },
  filterInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FCFCFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  inputText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    flex: 1,
  },
  placeholderText: {
    color: '#64748B',
    fontWeight: '400',
  },
  applyButton: {
    backgroundColor: '#A3F7CD',
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2DDA95',
    fontFamily: 'DM Sans',
  },
});

export default GroceryFilterModal;
