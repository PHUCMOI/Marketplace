using LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IDispatchRepository
{
    Task<Dispatch?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Dispatch?> GetByDealIdAsync(Guid dealId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Dispatch>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Dispatch>> GetByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task AddAsync(Dispatch dispatch, CancellationToken cancellationToken = default);
    void Remove(Dispatch dispatch);
}