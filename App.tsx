import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  FlatList,
  RefreshControl,
  Modal,
  Animated,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- Constants ---
const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0051D0',
  primaryLight: '#CCE7FF',
  secondary: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  placeholder: '#9CA3AF',
  disabled: '#F3F4F6',
};

const FONTS = {
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const SIZES = {
  input: 56,
  button: 48,
  icon: 24,
  headerHeight: 60,
};

// --- Animation Constants ---
const ANIMATION_DURATION = 300;

// --- User Data ---
const USERS = [
  {
    id: '1',
    username: 'devicelab',
    password: 'robustest',
    email: 'devicelab@robustest.com',
    name: 'Device Lab',
  },
  {
    id: '2',
    username: 'a',
    password: 'a',
    email: 'test@example.com',
    name: 'Test User',
  },
];

// --- Product Data ---
const PRODUCTS = [
  {
    id: 'appium',
    name: 'Appium',
    price: 7.5,
    originalPrice: 9.0,
    description:
      'An open-source tool for automating native, mobile web, and hybrid applications on iOS, Android, and Windows platforms. Perfect for cross-platform testing with extensive language support.',
    category: 'Mobile Testing',
    rating: 4.5,
    reviewCount: 1250,
    inStock: true,
    tags: ['cross-platform', 'mobile', 'automation'],
    features: [
      'iOS Testing',
      'Android Testing',
      'Cross-platform',
      'Multiple Languages',
    ],
  },
  {
    id: 'maestro',
    name: 'Maestro',
    price: 5.99,
    originalPrice: 7.99,
    description:
      'The simplest and most effective mobile UI testing framework. Built for developers and testers with a focus on ease of use and reliability.',
    category: 'Mobile Testing',
    rating: 4.8,
    reviewCount: 890,
    inStock: true,
    tags: ['simple', 'mobile', 'UI testing'],
    features: [
      'Simple Syntax',
      'Fast Execution',
      'No Flaky Tests',
      'Great Documentation',
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso',
    price: 1.5,
    originalPrice: 2.0,
    description:
      'A testing framework for Android to write concise, beautiful, and reliable Android UI tests. Developed by Google.',
    category: 'Android Testing',
    rating: 4.3,
    reviewCount: 2100,
    inStock: true,
    tags: ['android', 'google', 'UI testing'],
    features: ['Android Native', 'Google Support', 'Fast', 'Reliable'],
  },
  {
    id: 'selenium',
    name: 'Selenium',
    price: 2.3,
    originalPrice: 3.5,
    description:
      'A portable framework for testing web applications. It provides a playbook tool for authoring functional tests across browsers.',
    category: 'Web Testing',
    rating: 4.1,
    reviewCount: 5200,
    inStock: true,
    tags: ['web', 'browser', 'automation'],
    features: ['Multi-browser', 'Web Focus', 'Mature', 'Large Community'],
  },
  {
    id: 'cypress',
    name: 'Cypress',
    price: 8.1,
    originalPrice: 10.0,
    description:
      'A next-generation front-end testing tool built for the modern web. It addresses the key pain points developers and QA engineers face.',
    category: 'Web Testing',
    rating: 4.7,
    reviewCount: 3400,
    inStock: true,
    tags: ['modern', 'web', 'developer-friendly'],
    features: [
      'Real-time Reload',
      'Time Travel',
      'Debugging',
      'Modern Architecture',
    ],
  },
  {
    id: 'playwright',
    name: 'Playwright',
    price: 9.0,
    originalPrice: 12.0,
    description:
      'A Node.js library to automate Chromium, Firefox and WebKit with a single API. Developed by Microsoft for reliable end-to-end testing.',
    category: 'Web Testing',
    rating: 4.6,
    reviewCount: 1800,
    inStock: false,
    tags: ['microsoft', 'multi-browser', 'reliable'],
    features: ['Multi-browser', 'Microsoft', 'Reliable', 'Modern API'],
  },
  {
    id: 'xcuitest',
    name: 'XCUITest',
    price: 1.5,
    originalPrice: 2.5,
    description:
      "Apple's UI testing framework for iOS. It's integrated into Xcode and allows for comprehensive testing of the user interface.",
    category: 'iOS Testing',
    rating: 4.2,
    reviewCount: 950,
    inStock: true,
    tags: ['ios', 'apple', 'native'],
    features: [
      'iOS Native',
      'Xcode Integration',
      'Apple Support',
      'UI Testing',
    ],
  },
  {
    id: 'jest',
    name: 'Jest',
    price: 4.75,
    originalPrice: 6.0,
    description:
      'A delightful JavaScript Testing Framework with a focus on simplicity. Works with projects using Babel, TypeScript, Node, React, Angular, Vue and more.',
    category: 'Unit Testing',
    rating: 4.4,
    reviewCount: 4200,
    inStock: true,
    tags: ['javascript', 'unit testing', 'facebook'],
    features: ['Zero Config', 'Snapshots', 'Mocking', 'Code Coverage'],
  },
  {
    id: 'mocha',
    name: 'Mocha',
    price: 3.25,
    originalPrice: 4.5,
    description:
      'A feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.',
    category: 'Unit Testing',
    rating: 4.0,
    reviewCount: 2800,
    inStock: true,
    tags: ['javascript', 'flexible', 'async'],
    features: ['Flexible', 'Async Support', 'Browser & Node', 'Rich Features'],
  },
  {
    id: 'pytest',
    name: 'Pytest',
    price: 6.8,
    originalPrice: 8.5,
    description:
      'A framework that makes it easy to write small, readable tests, and can scale to support complex functional testing for applications and libraries.',
    category: 'Python Testing',
    rating: 4.5,
    reviewCount: 1600,
    inStock: true,
    tags: ['python', 'scalable', 'readable'],
    features: ['Simple Syntax', 'Fixtures', 'Plugins', 'Scalable'],
  },
  {
    id: 'testng',
    name: 'TestNG',
    price: 4.2,
    originalPrice: 5.5,
    description:
      'A testing framework inspired from JUnit and NUnit but introducing some new functionalities that make it more powerful and easier to use.',
    category: 'Java Testing',
    rating: 4.1,
    reviewCount: 1100,
    inStock: true,
    tags: ['java', 'powerful', 'annotations'],
    features: ['Annotations', 'Parallel Testing', 'Data Providers', 'Flexible'],
  },
];

// --- State Management with useReducer ---
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.product.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { ...action.product, quantity: 1 }];

    case 'REMOVE_FROM_CART':
      const item = state.find(item => item.id === action.product.id);
      if (item && item.quantity === 1) {
        return state.filter(item => item.id !== action.product.id);
      }
      return state.map(item =>
        item.id === action.product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );

    case 'CLEAR_CART':
      return [];

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item,
      );

    default:
      return state;
  }
};

// --- Utility Functions ---
const formatPrice = price => `$${price.toFixed(2)}`;

const formatDiscount = (originalPrice, currentPrice) => {
  const discount = (
    ((originalPrice - currentPrice) / originalPrice) *
    100
  ).toFixed(0);
  return `${discount}% OFF`;
};

const validateInput = (value, type, options = {}) => {
  const trimmed = value.trim();

  switch (type) {
    case 'username':
      return trimmed.length >= 2 && trimmed.length <= 50;
    case 'password':
      return trimmed.length >= 1; // In real app, should be stronger
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    case 'address':
      return trimmed.length >= 5;
    case 'city':
      return trimmed.length >= 2;
    case 'zip':
      return /^\d{5}(-\d{4})?$/.test(trimmed);
    case 'card':
      return /^\d{13,19}$/.test(trimmed.replace(/\s/g, ''));
    case 'search':
      return true;
    default:
      return false;
  }
};

const formatCardNumber = value => {
  return value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

// --- Custom Hooks ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useAnimation = (initialValue = 0) => {
  const animatedValue = useMemo(
    () => new Animated.Value(initialValue),
    [initialValue],
  );

  const animate = useCallback(
    (toValue, duration = ANIMATION_DURATION) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        useNativeDriver: false,
      }).start();
    },
    [animatedValue],
  );

  return [animatedValue, animate];
};

// --- Enhanced Components ---

// Loading Component
const LoadingSpinner = React.memo(
  ({ size = 'small', color = COLORS.primary }) => (
    <ActivityIndicator size={size} color={color} />
  ),
);

// Button Component
const Button = React.memo(
  ({
    title,
    onPress,
    disabled = false,
    variant = 'primary',
    size = 'medium',
    loading = false,
    style,
    ...props
  }) => {
    const buttonStyles = [
      styles.button,
      styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
      disabled && styles.buttonDisabled,
      style,
    ];

    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner
            color={variant === 'primary' ? COLORS.surface : COLORS.primary}
          />
        ) : (
          <Text
            style={[
              styles.buttonText,
              styles[
                `buttonText${
                  variant.charAt(0).toUpperCase() + variant.slice(1)
                }`
              ],
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

// Input Component
const Input = React.memo(
  ({
    label,
    error,
    containerStyle,
    inputStyle,
    leftIcon,
    rightIcon,
    ...props
  }) => {
    return (
      <View style={[styles.inputContainer, containerStyle]}>
        {label && <Text style={styles.inputLabel}>{label}</Text>}
        <View style={[styles.inputWrapper, error && styles.inputError]}>
          {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
          <TextInput
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              inputStyle,
            ]}
            placeholderTextColor={COLORS.placeholder}
            {...props}
          />
          {rightIcon && <View style={styles.inputIcon}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.inputErrorText}>{error}</Text>}
      </View>
    );
  },
);

// Rating Component
const Rating = React.memo(({ rating, reviewCount, size = 'small' }) => (
  <View style={styles.ratingContainer}>
    <Text
      style={[styles.ratingText, size === 'large' && styles.ratingTextLarge]}
    >
      ⭐ {rating}
    </Text>
    {reviewCount && <Text style={styles.reviewCountText}>({reviewCount})</Text>}
  </View>
));

// Price Component
const Price = React.memo(({ price, originalPrice, size = 'medium' }) => (
  <View style={styles.priceContainer}>
    <Text style={[styles.price, size === 'large' && styles.priceLarge]}>
      {formatPrice(price)}
    </Text>
    {originalPrice && originalPrice > price && (
      <>
        <Text style={styles.originalPrice}>{formatPrice(originalPrice)}</Text>
        <Text style={styles.discountBadge}>
          {formatDiscount(originalPrice, price)}
        </Text>
      </>
    )}
  </View>
));

// --- Splash Screen Component ---
const SplashScreen = React.memo(() => {
  const [fadeAnim] = useAnimation(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  return (
    <View style={styles.splashContainer} accessibilityLabel="splash-screen">
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('./assets/RobusTest.png')}
          style={styles.splashLogo}
        />
        <Text style={styles.appTitle}>TestHive</Text>
        <Text style={styles.appSubtitle}>Testing Framework Store</Text>
      </Animated.View>
      <LoadingSpinner size="large" />
    </View>
  );
});

// --- Enhanced Login Screen ---
const LoginPage = React.memo(({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const updateField = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!validateInput(formData.username, 'username')) {
      newErrors.username = 'Username must be 2-50 characters';
    }

    if (!validateInput(formData.password, 'password')) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call with more realistic delay
    setTimeout(() => {
      const foundUser = USERS.find(
        user =>
          user.username === formData.username.trim() &&
          user.password === formData.password,
      );

      if (foundUser) {
        onLoginSuccess(foundUser);
      } else {
        setErrors({ general: 'Invalid username or password' });
      }
      setIsLoading(false);
    }, 1500);
  }, [formData, validateForm, onLoginSuccess]);

  return (
    <ScrollView
      style={styles.loginContainer}
      contentContainerStyle={styles.loginContent}
      accessibilityLabel="login-screen"
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.loginLogoContainer}>
        <Image
          source={require('./assets/RobusTest.png')}
          style={styles.loginLogo}
        />
        <Text style={styles.loginTitle}>Welcome Back</Text>
        <Text style={styles.loginSubtitle}>
          Sign in to continue to TestHive
        </Text>
      </View>

      <View style={styles.loginForm}>
        <Input
          label="Username"
          value={formData.username}
          onChangeText={value => updateField('username', value)}
          error={errors.username}
          accessibilityLabel="username-input"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          leftIcon={<Text style={styles.inputIconText}>👤</Text>}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={value => updateField('password', value)}
          error={errors.password}
          secureTextEntry
          accessibilityLabel="password-input"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          leftIcon={<Text style={styles.inputIconText}>🔒</Text>}
        />

        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberMeText}>Remember me</Text>
        </TouchableOpacity>

        {errors.general && (
          <Text style={styles.errorText} accessibilityLabel="error-message">
            {errors.general}
          </Text>
        )}

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.loginButton}
          accessibilityLabel="login-button"
        />

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
});

// --- Enhanced Header Component ---
const AppHeader = React.memo(
  ({
    user,
    cartItemCount,
    onGoToCart,
    onLogout,
    showSearch = false,
    onSearchChange,
  }) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleMenuPress = () => {
      Alert.alert('Menu', 'Choose an option', [
        { text: 'Profile', onPress: () => console.log('Profile pressed') },
        { text: 'Orders', onPress: () => console.log('Orders pressed') },
        { text: 'Settings', onPress: () => console.log('Settings pressed') },
        { text: 'Help', onPress: () => console.log('Help pressed') },
        { text: 'Logout', onPress: onLogout, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]);
    };

    const handleSearchToggle = () => {
      setSearchVisible(!searchVisible);
      if (!searchVisible) {
        setSearchQuery('');
        onSearchChange?.('');
      }
    };

    const handleSearchChange = text => {
      setSearchQuery(text);
      onSearchChange?.(text);
    };

    return (
      <View style={styles.headerContainer}>
        {searchVisible ? (
          <View style={styles.searchHeaderContainer}>
            <TouchableOpacity
              onPress={handleSearchToggle}
              style={styles.searchBackButton}
            >
              <Text style={styles.searchBackIcon}>←</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.searchHeaderInput}
              placeholder="Search frameworks..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor={COLORS.placeholder}
              autoFocus
            />
          </View>
        ) : (
          <>
            <View style={styles.headerLeft}>
              <Image
                source={require('./assets/RobusTest.png')}
                style={styles.headerLogo}
              />
              <View>
                <Text style={styles.headerTitle}>TestHive</Text>
                <Text style={styles.headerSubtitle}>
                  Hello, {user?.name || user?.username || ''}!
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {showSearch && (
                <TouchableOpacity
                  onPress={handleSearchToggle}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerIcon}>🔍</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.cartContainer}
                onPress={onGoToCart}
                accessibilityLabel="cart-button"
              >
                <Text style={styles.headerIcon}>🛒</Text>
                {cartItemCount > 0 && (
                  <View
                    style={styles.cartBadge}
                    accessibilityLabel="cart-badge"
                  >
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleMenuPress}
                accessibilityLabel="menu-button"
                style={styles.headerButton}
              >
                <Text style={styles.headerIcon}>☰</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  },
);

// --- Enhanced Product Item Component ---
const ProductItem = React.memo(
  ({ product, cartItem, onAddToCart, onRemoveFromCart, onSelectProduct }) => {
    const [addingToCart, setAddingToCart] = useState(false);

    const handleAddPress = useCallback(
      async e => {
        e.stopPropagation();
        setAddingToCart(true);

        // Simulate a brief loading state for better UX
        setTimeout(() => {
          onAddToCart(product);
          setAddingToCart(false);
        }, 300);
      },
      [product, onAddToCart],
    );

    const handleRemovePress = useCallback(
      e => {
        e.stopPropagation();
        onRemoveFromCart(product);
      },
      [product, onRemoveFromCart],
    );

    const handleProductPress = useCallback(() => {
      onSelectProduct(product);
    }, [product, onSelectProduct]);

    return (
      <TouchableOpacity
        onPress={handleProductPress}
        accessibilityLabel={`product-item-${product.id}`}
        style={styles.productItemContainer}
        activeOpacity={0.7}
      >
        <View style={styles.productItem}>
          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <View style={styles.discountBadgeContainer}>
                    <Text style={styles.discountBadgeSmall}>
                      {formatDiscount(product.originalPrice, product.price)}
                    </Text>
                  </View>
                )}
            </View>

            <Text style={styles.productCategory}>{product.category}</Text>

            <View style={styles.productTags}>
              {product.tags?.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.productPriceRow}>
              <Price
                price={product.price}
                originalPrice={product.originalPrice}
              />
              <Rating
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </View>

            {!product.inStock && (
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            )}
          </View>

          <View style={styles.productActions}>
            {cartItem ? (
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleRemovePress}
                  accessibilityLabel={`remove-from-cart-button-${product.id}`}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text
                  style={styles.quantityText}
                  accessibilityLabel={`quantity-text-${product.id}`}
                >
                  {cartItem.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleAddPress}
                  accessibilityLabel={`add-to-cart-button-${product.id}`}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <LoadingSpinner size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={styles.quantityButtonText}>+</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title={product.inStock ? 'Add' : 'Unavailable'}
                onPress={handleAddPress}
                disabled={!product.inStock || addingToCart}
                loading={addingToCart}
                size="small"
                variant={product.inStock ? 'primary' : 'disabled'}
                accessibilityLabel={`add-to-cart-button-${product.id}`}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

// --- Enhanced Products Screen ---
const ProductPage = React.memo(
  ({
    user,
    cart,
    onAddToCart,
    onRemoveFromCart,
    onSelectProduct,
    onGoToCart,
    onLogout,
  }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [refreshing, setRefreshing] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = useMemo(() => {
      const cats = ['All', ...new Set(PRODUCTS.map(p => p.category))];
      return cats;
    }, []);

    const sortOptions = useMemo(
      () => [
        { label: 'Name', value: 'name' },
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
        { label: 'Rating', value: 'rating' },
        { label: 'Most Reviews', value: 'reviews' },
      ],
      [],
    );

    const filteredAndSortedProducts = useMemo(() => {
      let filtered = PRODUCTS.filter(product => {
        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          product.tags?.some(tag =>
            tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
          );
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      // Sort products
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'reviews':
            return (b.reviewCount || 0) - (a.reviewCount || 0);
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });

      return filtered;
    }, [debouncedSearchQuery, selectedCategory, sortBy]);

    const cartItemCount = useMemo(() => {
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      // Simulate refresh
      setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const renderProduct = useCallback(
      ({ item }) => {
        const cartItem = cart.find(cartItem => cartItem.id === item.id);
        return (
          <ProductItem
            product={item}
            cartItem={cartItem}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            onSelectProduct={onSelectProduct}
          />
        );
      },
      [cart, onAddToCart, onRemoveFromCart, onSelectProduct],
    );

    return (
      <View
        style={styles.productPageContainer}
        accessibilityLabel="products-screen"
      >
        <AppHeader
          user={user}
          cartItemCount={cartItemCount}
          onGoToCart={onGoToCart}
          onLogout={onLogout}
          showSearch={true}
          onSearchChange={setSearchQuery}
        />

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortContent}
          >
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortButton,
                  sortBy === option.value && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy(option.value)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === option.value && styles.sortButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products List */}
        <FlatList
          data={filteredAndSortedProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateText}>No products found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
          ListHeaderComponent={
            filteredAndSortedProducts.length > 0 ? (
              <Text style={styles.resultsCount}>
                {filteredAndSortedProducts.length} framework
                {filteredAndSortedProducts.length !== 1 ? 's' : ''} found
              </Text>
            ) : null
          }
        />
      </View>
    );
  },
);

// --- Enhanced Product Detail Screen ---
const ProductDetailPage = React.memo(
  ({ product, onGoBack, onAddToCart, cart }) => {
    const [selectedFeature, setSelectedFeature] = useState(0);
    const cartItem = cart.find(item => item.id === product.id);
    const [addingToCart, setAddingToCart] = useState(false);

    const handleAddToCart = useCallback(async () => {
      setAddingToCart(true);
      setTimeout(() => {
        onAddToCart(product);
        setAddingToCart(false);
      }, 300);
    }, [onAddToCart, product]);

    return (
      <View
        style={styles.productPageContainer}
        accessibilityLabel="product-detail-screen"
      >
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={onGoBack}
            style={styles.backButton}
            accessibilityLabel="back-button"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            {product.name}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.detailContent}>
          {/* Main Product Info */}
          <View style={styles.detailMainInfo}>
            <View style={styles.detailNameRow}>
              <Text style={styles.detailProductName}>{product.name}</Text>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <View style={styles.detailDiscountBadge}>
                    <Text style={styles.detailDiscountText}>
                      {formatDiscount(product.originalPrice, product.price)}
                    </Text>
                  </View>
                )}
            </View>

            <Text style={styles.detailCategory}>{product.category}</Text>

            <View style={styles.detailPriceRow}>
              <Price
                price={product.price}
                originalPrice={product.originalPrice}
                size="large"
              />
              <Rating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="large"
              />
            </View>

            <View style={styles.stockContainer}>
              <Text
                style={[
                  styles.stockText,
                  product.inStock ? styles.inStock : styles.outOfStock,
                ]}
              >
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </Text>
            </View>

            {/* Tags */}
            <View style={styles.detailTagsContainer}>
              {product.tags?.map((tag, index) => (
                <View key={index} style={styles.detailTag}>
                  <Text style={styles.detailTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.detailDescriptionContainer}>
            <Text style={styles.detailSectionTitle}>Description</Text>
            <Text style={styles.detailDescription}>{product.description}</Text>
          </View>

          {/* Features */}
          {product.features && (
            <View style={styles.detailFeaturesContainer}>
              <Text style={styles.detailSectionTitle}>Key Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.detailActions}>
            {cartItem ? (
              <View style={styles.detailQuantityControl}>
                <TouchableOpacity
                  style={styles.detailQuantityButton}
                  onPress={() => onAddToCart(product)}
                >
                  <Text style={styles.detailQuantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.detailQuantityText}>
                  {cartItem.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.detailQuantityButton}
                  onPress={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <LoadingSpinner size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={styles.detailQuantityButtonText}>+</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
                onPress={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                loading={addingToCart}
                size="large"
                style={styles.detailAddButton}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  },
);

// --- Enhanced Cart Screen ---
const CartPage = React.memo(
  ({ cart, onGoBack, onAddToCart, onRemoveFromCart, onCheckout }) => {
    const [removingItems, setRemovingItems] = useState(new Set());

    const total = useMemo(() => {
      return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const savings = useMemo(() => {
      return cart.reduce((sum, item) => {
        const originalTotal =
          (item.originalPrice || item.price) * item.quantity;
        const currentTotal = item.price * item.quantity;
        return sum + (originalTotal - currentTotal);
      }, 0);
    }, [cart]);

    const itemCount = useMemo(() => {
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const handleRemoveItem = useCallback(
      async item => {
        setRemovingItems(prev => new Set(prev).add(item.id));
        setTimeout(() => {
          onRemoveFromCart(item);
          setRemovingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        }, 300);
      },
      [onRemoveFromCart],
    );

    const renderCartItem = useCallback(
      ({ item }) => (
        <View
          style={styles.cartItem}
          accessibilityLabel={`cart-item-${item.id}`}
        >
          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemName}>{item.name}</Text>
            <Text style={styles.cartItemCategory}>{item.category}</Text>
            <View style={styles.cartItemPriceRow}>
              <Price price={item.price} originalPrice={item.originalPrice} />
              <Text style={styles.cartItemSubtotal}>
                Subtotal: {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          </View>

          <View style={styles.cartItemActions}>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleRemoveItem(item)}
                accessibilityLabel={`remove-from-cart-button-${item.id}`}
                disabled={removingItems.has(item.id)}
              >
                {removingItems.has(item.id) ? (
                  <LoadingSpinner size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.quantityButtonText}>−</Text>
                )}
              </TouchableOpacity>
              <Text
                style={styles.quantityText}
                accessibilityLabel={`quantity-text-${item.id}`}
              >
                {item.quantity}
              </Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onAddToCart(item)}
                accessibilityLabel={`add-to-cart-button-${item.id}`}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ),
      [handleRemoveItem, onAddToCart, removingItems],
    );

    return (
      <View
        style={styles.productPageContainer}
        accessibilityLabel="cart-screen"
      >
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={onGoBack}
            style={styles.backButton}
            accessibilityLabel="back-button"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>My Cart ({itemCount} items)</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>
              Add some testing frameworks to get started
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.cartContent}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.cartFooter}>
              {savings > 0 && (
                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsText}>
                    You're saving {formatPrice(savings)}!
                  </Text>
                </View>
              )}

              <View style={styles.cartTotalContainer}>
                <Text style={styles.cartTotalLabel}>Total Amount</Text>
                <Text
                  style={styles.cartTotalText}
                  accessibilityLabel="cart-total-text"
                >
                  {formatPrice(total)}
                </Text>
              </View>

              <Button
                title="Proceed to Checkout"
                onPress={onCheckout}
                size="large"
                style={styles.checkoutButton}
                accessibilityLabel="checkout-button"
              />
            </View>
          </>
        )}
      </View>
    );
  },
);

// --- Enhanced Address Form ---
const AddressPage = React.memo(({ onGoBack, onAddressSubmit }) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [errors, setErrors] = useState({});

  const updateField = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!validateInput(formData.address, 'address')) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    if (!validateInput(formData.city, 'city')) {
      newErrors.city = 'City is required';
    }

    if (!validateInput(formData.zip, 'zip')) {
      newErrors.zip = 'Valid ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onAddressSubmit(formData);
    }
  }, [formData, validateForm, onAddressSubmit]);

  const canSubmit = useMemo(() => {
    return Object.values(formData).every(value => value.trim().length > 0);
  }, [formData]);

  return (
    <View
      style={styles.productPageContainer}
      accessibilityLabel="address-screen"
    >
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.backButton}
          accessibilityLabel="back-button-cart"
        >
          <Text style={styles.backButtonText}>← Back to Cart</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Shipping Address</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Street Address"
          placeholder="123 Main Street"
          value={formData.address}
          onChangeText={value => updateField('address', value)}
          error={errors.address}
          accessibilityLabel="address-input"
        />

        <Input
          label="City"
          placeholder="San Francisco"
          value={formData.city}
          onChangeText={value => updateField('city', value)}
          error={errors.city}
          accessibilityLabel="city-input"
        />

        <View style={styles.rowInputs}>
          <Input
            label="State"
            placeholder="CA"
            value={formData.state}
            onChangeText={value => updateField('state', value)}
            error={errors.state}
            containerStyle={styles.halfInput}
            accessibilityLabel="state-input"
          />

          <Input
            label="ZIP Code"
            placeholder="94105"
            value={formData.zip}
            onChangeText={value => updateField('zip', value)}
            error={errors.zip}
            keyboardType="number-pad"
            containerStyle={styles.halfInput}
            accessibilityLabel="zip-input"
          />
        </View>

        <Input
          label="Country"
          value={formData.country}
          onChangeText={value => updateField('country', value)}
          accessibilityLabel="country-input"
        />

        <Button
          title="Next: Payment"
          onPress={handleSubmit}
          disabled={!canSubmit}
          size="large"
          style={styles.formSubmitButton}
          accessibilityLabel="next-button"
        />
      </ScrollView>
    </View>
  );
});

// --- Enhanced Payment Form ---
const PaymentPage = React.memo(({ onGoBack, onPaymentSubmit }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = useCallback(
    (field, value) => {
      let formattedValue = value;

      // Format card number
      if (field === 'cardNumber') {
        formattedValue = formatCardNumber(value);
      }

      // Format expiry date
      if (field === 'expiryDate') {
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .substr(0, 5);
      }

      // Format CVV
      if (field === 'cvv') {
        formattedValue = value.replace(/\D/g, '').substr(0, 4);
      }

      setFormData(prev => ({ ...prev, [field]: formattedValue }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!validateInput(formData.cardNumber, 'card')) {
      newErrors.cardNumber = 'Valid card number is required';
    }

    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
    }

    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Valid CVV is required';
    }

    if (formData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onPaymentSubmit(formData);
    }
  }, [formData, validateForm, onPaymentSubmit]);

  const canSubmit = useMemo(() => {
    return Object.values(formData).every(value => value.trim().length > 0);
  }, [formData]);

  return (
    <View
      style={styles.productPageContainer}
      accessibilityLabel="payment-screen"
    >
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.backButton}
          accessibilityLabel="back-button-address"
        >
          <Text style={styles.backButtonText}>← Back to Address</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Payment Information</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Cardholder Name"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChangeText={value => updateField('cardholderName', value)}
          error={errors.cardholderName}
          accessibilityLabel="cardholder-name-input"
        />

        <Input
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChangeText={value => updateField('cardNumber', value)}
          error={errors.cardNumber}
          keyboardType="number-pad"
          accessibilityLabel="card-number-input"
          maxLength={19}
        />

        <View style={styles.rowInputs}>
          <Input
            label="Expiry Date"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChangeText={value => updateField('expiryDate', value)}
            error={errors.expiryDate}
            keyboardType="number-pad"
            containerStyle={styles.halfInput}
            accessibilityLabel="expiry-date-input"
            maxLength={5}
          />

          <Input
            label="CVV"
            placeholder="123"
            value={formData.cvv}
            onChangeText={value => updateField('cvv', value)}
            error={errors.cvv}
            keyboardType="number-pad"
            secureTextEntry
            containerStyle={styles.halfInput}
            accessibilityLabel="cvv-input"
            maxLength={4}
          />
        </View>

        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>

        <Button
          title="Pay Now"
          onPress={handleSubmit}
          disabled={!canSubmit}
          size="large"
          style={styles.formSubmitButton}
          accessibilityLabel="pay-now-button"
        />
      </ScrollView>
    </View>
  );
});

// --- Enhanced Success Screen ---
const CheckoutSuccessPage = React.memo(
  ({ onGoToHome, orderTotal, itemCount }) => {
    const [orderNumber] = useState(() => Math.floor(Math.random() * 1000000));
    const [celebrationAnim] = useAnimation(0);

    useEffect(() => {
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, [celebrationAnim]);

    return (
      <View
        style={styles.checkoutContainer}
        accessibilityLabel="checkout-success-screen"
      >
        <ScrollView contentContainerStyle={styles.checkoutContent}>
          <Animated.View
            style={[
              styles.celebrationContainer,
              { transform: [{ scale: celebrationAnim }] },
            ]}
          >
            <Text style={styles.checkoutIcon}>🎉</Text>
            <Text style={styles.checkoutTitle}>Order Successful!</Text>
            <Text style={styles.checkoutMessage}>
              Thank you for your purchase! Your testing frameworks will help you
              build amazing applications.
            </Text>
          </Animated.View>

          <View style={styles.orderSummary}>
            <Text style={styles.orderSummaryTitle}>Order Summary</Text>
            <View style={styles.orderSummaryRow}>
              <Text style={styles.orderSummaryLabel}>Order Number:</Text>
              <Text style={styles.orderSummaryValue}>#{orderNumber}</Text>
            </View>
            <View style={styles.orderSummaryRow}>
              <Text style={styles.orderSummaryLabel}>Items:</Text>
              <Text style={styles.orderSummaryValue}>{itemCount}</Text>
            </View>
            <View style={styles.orderSummaryRow}>
              <Text style={styles.orderSummaryLabel}>Total:</Text>
              <Text style={styles.orderSummaryValue}>
                {formatPrice(orderTotal)}
              </Text>
            </View>
            <View style={styles.orderSummaryRow}>
              <Text style={styles.orderSummaryLabel}>Delivery:</Text>
              <Text style={styles.orderSummaryValue}>Instant Download</Text>
            </View>
          </View>

          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>What's Next?</Text>
            <Text style={styles.nextStepsText}>
              • Check your email for download links{'\n'}• Visit our
              documentation center{'\n'}• Join our community forum for support
            </Text>
          </View>
        </ScrollView>

        <View style={styles.successActions}>
          <Button
            title="Continue Shopping"
            onPress={onGoToHome}
            size="large"
            style={styles.backToHomeButton}
            accessibilityLabel="back-to-home-button"
          />
        </View>
      </View>
    );
  },
);

// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('splash');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = useCallback(user => {
    setLoggedInUser(user);
    setCurrentPage('products');
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setLoggedInUser(null);
          dispatch({ type: 'CLEAR_CART' });
          setSelectedProduct(null);
          setOrderData(null);
          setShippingAddress(null);
          setPaymentInfo(null);
          setCurrentPage('login');
        },
      },
    ]);
  }, []);

  const handleAddToCart = useCallback(product => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', product });
  }, []);

  const handleRemoveFromCart = useCallback(product => {
    dispatch({ type: 'REMOVE_FROM_CART', product });
  }, []);

  const handleSelectProduct = useCallback(product => {
    setSelectedProduct(product);
    setCurrentPage('detail');
  }, []);

  const handleGoToCart = useCallback(() => {
    setCurrentPage('cart');
  }, []);

  const handleCheckout = useCallback(() => {
    setCurrentPage('address');
  }, []);

  const handleAddressSubmit = useCallback(addressData => {
    setShippingAddress(addressData);
    setCurrentPage('payment');
  }, []);

  const handlePaymentSubmit = useCallback(
    paymentData => {
      setPaymentInfo(paymentData);
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setOrderData({ total, itemCount });
      setCurrentPage('checkoutSuccess');
    },
    [cart],
  );

  const handleGoToHome = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    setSelectedProduct(null);
    setOrderData(null);
    setShippingAddress(null);
    setPaymentInfo(null);
    setCurrentPage('products');
  }, []);

  const handleGoBack = useCallback(() => {
    switch (currentPage) {
      case 'detail':
      case 'cart':
        setSelectedProduct(null);
        setCurrentPage('products');
        break;
      case 'address':
        setCurrentPage('cart');
        break;
      case 'payment':
        setCurrentPage('address');
        break;
      default:
        setCurrentPage('products');
    }
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'products':
        return (
          <ProductPage
            user={loggedInUser}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onSelectProduct={handleSelectProduct}
            onGoToCart={handleGoToCart}
            onLogout={handleLogout}
          />
        );
      case 'detail':
        return (
          <ProductDetailPage
            product={selectedProduct}
            onGoBack={handleGoBack}
            onAddToCart={handleAddToCart}
            cart={cart}
          />
        );
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onGoBack={handleGoBack}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        );
      case 'address':
        return (
          <AddressPage
            onGoBack={handleGoBack}
            onAddressSubmit={handleAddressSubmit}
          />
        );
      case 'payment':
        return (
          <PaymentPage
            onGoBack={handleGoBack}
            onPaymentSubmit={handlePaymentSubmit}
          />
        );
      case 'checkoutSuccess':
        return (
          <CheckoutSuccessPage
            onGoToHome={handleGoToHome}
            orderTotal={orderData?.total || 0}
            itemCount={orderData?.itemCount || 0}
          />
        );
      default:
        return <SplashScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      {renderContent()}
    </SafeAreaView>
  );
};

// --- Enhanced Styles ---
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Button Styles
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
    opacity: 0.6,
  },
  buttonSmall: {
    height: 36,
    paddingHorizontal: SPACING.sm,
  },
  buttonMedium: {
    height: SIZES.button,
  },
  buttonLarge: {
    height: SIZES.input,
    paddingHorizontal: SPACING.lg,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  buttonTextPrimary: {
    color: COLORS.surface,
  },
  buttonTextSecondary: {
    color: COLORS.text,
  },

  // Input Styles
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    height: SIZES.input,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  inputErrorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  inputIcon: {
    marginHorizontal: SPACING.xs,
  },
  inputIconText: {
    fontSize: 16,
  },

  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  splashLogo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.lg,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },

  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  loginLogoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  loginLogo: {
    width: 80,
    height: 80,
    marginBottom: SPACING.lg,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  loginSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  loginForm: {
    width: '100%',
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  forgotPasswordButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: SIZES.headerHeight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
  headerIcon: {
    fontSize: SIZES.icon,
    color: COLORS.text,
  },
  cartContainer: {
    position: 'relative',
    padding: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },

  // Search Header Styles
  searchHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  searchBackButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  searchBackIcon: {
    fontSize: 20,
    color: COLORS.primary,
  },
  searchHeaderInput: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.background,
    borderRadius: 22,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },

  // Product Page Styles
  productPageContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoriesContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  categoryButtonTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },

  // Sort Styles
  sortContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    maxHeight: 50,
  },
  sortContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  sortButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },
  sortButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  sortButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Product List Styles
  productList: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontFamily: FONTS.regular,
  },
  productItemContainer: {
    marginVertical: SPACING.xs,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  productTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: FONTS.regular,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productActions: {
    minWidth: 100,
    alignItems: 'flex-end',
  },
  outOfStockText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
  },

  // Price Component Styles
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  priceLarge: {
    fontSize: 28,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  discountBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: SPACING.xs,
  },
  discountBadgeContainer: {
    marginLeft: SPACING.sm,
  },
  discountBadgeSmall: {
    backgroundColor: COLORS.secondary,
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    fontFamily: FONTS.bold,
  },

  // Rating Component Styles
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  ratingTextLarge: {
    fontSize: 16,
  },
  reviewCountText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontFamily: FONTS.regular,
  },

  // Quantity Control Styles
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
    minWidth: 24,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },

  // Detail Page Styles
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: SIZES.headerHeight,
  },
  backButton: {
    marginRight: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: FONTS.regular,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    fontFamily: FONTS.bold,
  },
  detailContent: {
    padding: SPACING.lg,
  },
  detailMainInfo: {
    marginBottom: SPACING.lg,
  },
  detailNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  detailProductName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  detailDiscountBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginLeft: SPACING.sm,
  },
  detailDiscountText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  detailCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontFamily: FONTS.regular,
  },
  detailPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  stockContainer: {
    marginBottom: SPACING.md,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.bold,
  },
  inStock: {
    color: COLORS.success,
  },
  outOfStock: {
    color: COLORS.error,
  },
  detailTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  detailTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  detailTagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  detailDescriptionContainer: {
    marginBottom: SPACING.lg,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  detailDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
  detailFeaturesContainer: {
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    fontSize: 16,
    color: COLORS.success,
    marginRight: SPACING.sm,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    flex: 1,
  },
  detailActions: {
    alignItems: 'center',
  },
  detailQuantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.xs,
  },
  detailQuantityButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailQuantityButtonText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  detailQuantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    minWidth: 40,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  detailAddButton: {
    width: '100%',
    maxWidth: 300,
  },

  // Cart Page Styles
  cartContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyCartIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyCartText: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginVertical: SPACING.xs,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.bold,
  },
  cartItemCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  cartItemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemSubtotal: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  cartItemActions: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  cartFooter: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  savingsContainer: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  savingsText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  cartTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cartTotalLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  cartTotalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  checkoutButton: {
    width: '100%',
  },

  // Form Styles
  formContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  formSubmitButton: {
    marginTop: SPACING.lg,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  securityText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    flex: 1,
  },

  // Checkout Success Styles
  checkoutContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  checkoutContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  checkoutIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  checkoutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  checkoutMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
  orderSummary: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
    marginBottom: SPACING.lg,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderSummaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  orderSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  nextStepsContainer: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: 12,
    width: '100%',
    maxWidth: 320,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  nextStepsText: {
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 20,
    fontFamily: FONTS.regular,
  },
  successActions: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backToHomeButton: {
    width: '100%',
  },
});

export default App;
