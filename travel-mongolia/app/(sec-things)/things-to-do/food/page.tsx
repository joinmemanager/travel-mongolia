'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { FOOD_CATEGORIES, FOOD_SPOTS } from '@/lib/foodData';

export default function FoodPage() {
  return (
    <CategoryListing
      embedded
      intro="Нүүдэлчдийн шим тэжээлт мах, сүүн идээ, уламжлалт хорхог, шимийн айраг болон нутаг нутгийн давтагдашгүй амтыг мэдрэх аяллууд."
      categories={FOOD_CATEGORIES}
      spots={FOOD_SPOTS}
      countLabel="амталгаа, хоолны туршлага олдлоо"
      badge={(spot) => [spot.specialty]}
    />
  );
}
