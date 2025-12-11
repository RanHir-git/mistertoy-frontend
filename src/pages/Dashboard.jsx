import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Doughnut, PolarArea, Bar, Line } from 'react-chartjs-2';
ChartJS.register(
    RadialLinearScale, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement, 
    PointElement
);
import { useSelector } from 'react-redux';

export function Dashboard() {
    const toys = useSelector(store => store.toyModule.toys);
    const [activeChart, setActiveChart] = useState('stock');

    // Calculate data for Chart 1: Stock Status
    const toysInStock = toys.filter(toy => toy.inStock).length;
    const toysOutOfStock = toys.filter(toy => !toy.inStock).length;
    
    const stockData = {
        labels: ['In Stock', 'Out of Stock'],
        datasets: [{
            label: 'Stock Status',
            data: [toysInStock, toysOutOfStock],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 2
        }]
    };

    // Calculate data for Chart 2: Toys by Label
    const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'];
    const labelCounts = labels.map(label => 
        toys.filter(toy => toy.labels && toy.labels.includes(label)).length
    );
    
    const labelData = {
        labels: labels,
        datasets: [{
            label: 'Number of Toys',
            data: labelCounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)'
            ],
            borderWidth: 2
        }]
    };

    // Calculate data for Chart 3: Price Distribution
    const priceRanges = ['$0-100', '$101-300', '$301-500', '$501-700', '$701-900', '$901+'];
    const priceCounts = [
        toys.filter(toy => toy.price >= 0 && toy.price <= 100).length,
        toys.filter(toy => toy.price > 100 && toy.price <= 300).length,
        toys.filter(toy => toy.price > 300 && toy.price <= 500).length,
        toys.filter(toy => toy.price > 500 && toy.price <= 700).length,
        toys.filter(toy => toy.price > 700 && toy.price <= 900).length,
        toys.filter(toy => toy.price > 900).length
    ];
    
    const priceData = {
        labels: priceRanges,
        datasets: [{
            label: 'Number of Toys',
            data: priceCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    // Calculate data for Chart 4: Average Price per Label
    const averagePricePerLabel = labels.map(label => {
        const toysWithLabel = toys.filter(toy => toy.labels && toy.labels.includes(label));
        if (toysWithLabel.length === 0) return 0;
        const totalPrice = toysWithLabel.reduce((sum, toy) => sum + (toy.price || 0), 0);
        return totalPrice / toysWithLabel.length;
    });
    
    const pricePerLabelData = {
        labels: labels,
        datasets: [{
            label: 'Average Price per Label',
            data: averagePricePerLabel,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)'
            ],
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    const renderChart = () => {
        switch(activeChart) {
            case 'stock':
                return <Doughnut data={stockData} />;
            case 'labels':
                return <Bar data={labelData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
            case 'price':
                return <Line data={priceData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
            case 'pricePerLabel':
                return <Bar data={pricePerLabelData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
            default:
                return <Doughnut data={stockData} />;
        }
    };
    
    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                <button 
                    onClick={() => setActiveChart('stock')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeChart === 'stock' ? '#4CAF50' : '#f0f0f0',
                        color: activeChart === 'stock' ? 'white' : 'black',
                        border: '2px solid #4CAF50',
                        borderRadius: '5px',
                        fontWeight: activeChart === 'stock' ? 'bold' : 'normal'
                    }}
                >
                    Stock Status
                </button>
                <button 
                    onClick={() => setActiveChart('labels')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeChart === 'labels' ? '#4CAF50' : '#f0f0f0',
                        color: activeChart === 'labels' ? 'white' : 'black',
                        border: '2px solid #4CAF50',
                        borderRadius: '5px',
                        fontWeight: activeChart === 'labels' ? 'bold' : 'normal'
                    }}
                >
                    Toys by Label
                </button>
                <button 
                    onClick={() => setActiveChart('price')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeChart === 'price' ? '#4CAF50' : '#f0f0f0',
                        color: activeChart === 'price' ? 'white' : 'black',
                        border: '2px solid #4CAF50',
                        borderRadius: '5px',
                        fontWeight: activeChart === 'price' ? 'bold' : 'normal'
                    }}
                >
                    Price Distribution
                </button>
                <button 
                    onClick={() => setActiveChart('pricePerLabel')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeChart === 'pricePerLabel' ? '#4CAF50' : '#f0f0f0',
                        color: activeChart === 'pricePerLabel' ? 'white' : 'black',
                        border: '2px solid #4CAF50',
                        borderRadius: '5px',
                        fontWeight: activeChart === 'pricePerLabel' ? 'bold' : 'normal'
                    }}
                >
                    Prices per Label
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height: '300px'}}>
                {renderChart()}
            </div>
        </section>
    )
}