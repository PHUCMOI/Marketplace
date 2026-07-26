
using FluentValidation;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LogisticsMarketplace.Service.Application;

/// <summary>
/// Extension methods for registering application services
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Add application layer services to the dependency injection container
    /// </summary>
    /// <param name="services">Service collection</param>
    /// <returns>Service collection for chaining</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register AutoMapper with assembly scanning
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        // Register FluentValidation validators
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Register application services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IListingService, ListingService>();
        services.AddScoped<IBidService, BidService>();
        services.AddScoped<IDealService, DealService>();
        services.AddScoped<IDispatchService, DispatchService>();
        services.AddScoped<IVehicleService, VehicleService>();
        services.AddScoped<IDriverService, DriverService>();

        return services;
    }
}
