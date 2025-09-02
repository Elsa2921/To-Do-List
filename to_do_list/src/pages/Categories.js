import React from 'react';
import LinkPages from './LinkPages';
import '../assets/css/categories.css';
import CategoriesMain from '../componets/CategoriesMain';


function Categories(props) {
    return (
        <div>
            <LinkPages/>
            <CategoriesMain/>
        </div>
    );
}

export default Categories;