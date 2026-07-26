using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IOrganizationRepository
{
    Task<Organization?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Organization organization, CancellationToken cancellationToken = default);
}