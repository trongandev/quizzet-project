# 🚀 Vercel Optimization Guide - Giảm Function Invocations

## 📊 **Vấn đề hiện tại:**

-   Function invocations quá cao trên Vercel
-   Chi phí tăng do excessive API calls
-   Performance chậm do lack of caching

## 🎯 **Giải pháp đã implement:**

### 1. **Static Site Generation (SSG) + ISR**

```typescript
// app/flashcard/[id]/page.tsx
export const revalidate = 3600; // 1 hour ISR
export const dynamic = "force-static";
export const dynamicParams = true;

// Pre-generate popular flashcards
export async function generateStaticParams() {
    const popular = await GET_API("/list-flashcards?limit=50&sort=popular");
    return popular.map((item) => ({ id: item._id }));
}
```

### 2. **Smart Caching Strategy**

```typescript
// middleware.ts - Automatic caching headers
- Static assets: 1 year cache
- API routes: 1 hour cache + 24h stale
- Flashcard pages: 30min cache + 1h stale
- General pages: 5min cache + 10min stale
```

### 3. **Optimized Data Fetching**

```typescript
// hooks/useOptimizedFetch.ts
- localStorage cache với expiration
- Stale-while-revalidate strategy
- Fallback to cache khi API fail
- Automatic background refresh
```

### 4. **Edge Runtime cho API Routes**

```typescript
// api/flashcard/[id]/route.ts
export const runtime = "edge"; // Giảm cold start
export const revalidate = 3600; // ISR caching
```

### 5. **Component-level Optimization**

```typescript
// CFlashcardDetail.tsx
- Nhận initialData từ SSG
- Chỉ fetch khi cần thiết
- Smart state management
- Debounced audio calls
```

## 📈 **Kết quả mong đợi:**

### **Function Invocations giảm 70-80%:**

-   ❌ **Trước:** Mỗi visit = 1 function call
-   ✅ **Sau:**
    -   First visit: Serve from static (0 calls)
    -   Cache hit: Serve from CDN (0 calls)
    -   Cache miss: 1 call/hour (ISR)

### **Performance tăng:**

-   ⚡ **TTFB:** <100ms (static serve)
-   ⚡ **LCP:** <1s (pre-generated)
-   ⚡ **FCP:** <500ms (optimized assets)

### **Cost giảm:**

-   💰 **Function calls:** Giảm 70-80%
-   💰 **Bandwidth:** Giảm 50% (CDN cache)
-   💰 **Edge requests:** Giảm 60%

## 🛠️ **Cách deploy:**

### 1. **Update next.config.js:**

```javascript
module.exports = {
    experimental: {
        isrMemoryCacheSize: 0, // Avoid memory issues
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [{ key: "Cache-Control", value: "public, s-maxage=3600" }],
            },
        ];
    },
};
```

### 2. **Environment Variables:**

```bash
# .env.local
NEXT_PUBLIC_CACHE_ENABLED=true
NEXT_PUBLIC_CACHE_DURATION=1800000 # 30 minutes
```

### 3. **Vercel Configuration:**

```json
// vercel.json
{
    "functions": {
        "app/api/**/*": {
            "maxDuration": 10
        }
    },
    "headers": [
        {
            "source": "/api/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, s-maxage=3600, stale-while-revalidate=86400"
                }
            ]
        }
    ]
}
```

## 📊 **Monitoring:**

### **Kiểm tra Function Usage:**

1. Vercel Dashboard → Functions tab
2. Monitor "Invocations" metrics
3. Check "Cache Hit Rate"

### **Performance Metrics:**

1. Core Web Vitals trong Vercel Analytics
2. Lighthouse scores
3. Real User Monitoring (RUM)

### **Debug Commands:**

```bash
# Analyze bundle
npm run analyze

# Check cache status
curl -I https://your-domain.com/flashcard/123

# Purge specific cache
curl -X PURGE https://your-domain.com/api/flashcard/123
```

## 🎯 **Best Practices ongoing:**

### **1. ISR Strategy:**

-   Popular content: 1 hour revalidate
-   User-generated: 30 minutes revalidate
-   Static assets: Never revalidate

### **2. API Design:**

-   Batch requests khi possible
-   Implement pagination
-   Use GraphQL cho complex queries

### **3. Client-side:**

-   Lazy load non-critical components
-   Implement virtual scrolling for large lists
-   Use React.memo() cho expensive components

### **4. Database:**

-   Add proper indexes
-   Implement connection pooling
-   Cache database queries

## 🚨 **Alerts Setup:**

```javascript
// Monitor function usage
if (monthlyInvocations > threshold) {
    // Send alert to team
    // Scale down non-essential features
    // Increase cache duration temporarily
}
```

## 📝 **Notes:**

-   Test thoroughly trong staging environment
-   Monitor metrics for 1 week sau deploy
-   Fine-tune cache durations based on usage patterns
-   Keep fallback strategies cho cache failures
