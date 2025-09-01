'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ApiClient } from '@/lib/api'
import { Product } from '@/types/Product'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const productId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const fetchedProduct = await ApiClient.getProductById(productId)
        
        if (!fetchedProduct) {
          setError('Product not found')
          return
        }
        
        setProduct(fetchedProduct)
      } catch (err) {
        setError('Failed to load product. Please try again later.')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('⭐')
      } else {
        stars.push('☆')
      }
    }
    
    return stars.join('')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><a href="/" className="hover:text-blue-600">Home</a></li>
          <li>{'>'}</li>
          <li><a href="/products" className="hover:text-blue-600">Products</a></li>
          <li>{'>'}</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-yellow-500 text-lg">{renderStars(product.rating)}</span>
              <span className="text-gray-600">({product.rating}/5)</span>
            </div>
          </div>

          <div className="text-4xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Availability:</span>
                <span className={`ml-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">{product.category}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              disabled={product.stock === 0}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                product.stock > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full py-2 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Products
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Product ID: {product.id}</li>
              <li>• Added: {new Date(product.createdAt).toLocaleDateString()}</li>
              <li>• Rating: {product.rating}/5 stars</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
