import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PageHeaderWidgets  from '@/components/shared/pageHeader/PageHeaderWidgets'
import Product from '@/components/widgetsTables/ProductTable'
import Footer from '@/components/shared/Footer'

const Products = () => {
    return (
        <>
            <PageHeader >
                <PageHeaderWidgets />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <Product title={"Products"}/>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Products