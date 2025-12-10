// Etsy API v3 Types

export interface EtsyImage {
  listing_id: number;
  listing_image_id: number;
  url_75x75: string;
  url_170x135: string;
  url_570xN: string;
  url_fullxfull: string;
  full_height: number;
  full_width: number;
}

export interface EtsyShippingProfile {
  min_processing_time: number;
  max_processing_time: number;
  processing_time_unit: string;
}

export interface EtsyListing {
  listing_id: number;
  user_id: number;
  shop_id: number;
  title: string;
  description: string;
  state: string;
  creation_timestamp: number;
  created_timestamp: number;
  ending_timestamp: number;
  original_creation_timestamp: number;
  last_modified_timestamp: number;
  updated_timestamp: number;
  state_timestamp: number;
  quantity: number;
  shop_section_id: number | null;
  featured_rank: number;
  url: string;
  num_favorers: number;
  non_taxable: boolean;
  is_taxable: boolean;
  is_customizable: boolean;
  is_personalizable: boolean;
  personalization_is_required: boolean;
  personalization_char_count_max: number | null;
  personalization_instructions: string | null;
  listing_type: string;
  tags: string[];
  materials: string[];
  shipping_profile_id: number | null;
  processing_min: number | null;
  processing_max: number | null;
  who_made: string;
  when_made: string;
  is_supply: boolean;
  item_weight: number | null;
  item_weight_unit: string | null;
  item_length: number | null;
  item_width: number | null;
  item_height: number | null;
  item_dimensions_unit: string | null;
  is_private: boolean;
  style: string[];
  file_data: string;
  has_variations: boolean;
  should_auto_renew: boolean;
  language: string;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  taxonomy_id: number | null;
  images?: EtsyImage[];
  videos?: any[];
  shipping_profile?: EtsyShippingProfile;
}

export interface EtsyListingsResponse {
  count: number;
  results: EtsyListing[];
}

export interface EtsyShop {
  shop_id: number;
  shop_name: string;
  user_id: number;
  title: string;
  announcement: string | null;
  currency_code: string;
  is_vacation: boolean;
  vacation_message: string | null;
  sale_message: string | null;
  digital_sale_message: string | null;
  listing_active_count: number;
  url: string;
}

// Our internal Product type mapped from Etsy
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  category: string;
  description: string;
  isNew: boolean;
  inStock: boolean;
  quantity: number;
  etsyUrl: string;
  etsyListingId: number;
  tags: string[];
}

