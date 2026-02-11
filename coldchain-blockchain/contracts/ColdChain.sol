// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ColdChain {

    struct Shipment {
        uint256 maxBreachDuration;
        uint256 escrowAmount;
        address logisticsPartner;
        bool active;
    }

    mapping(uint256 => Shipment) public shipments;

    event ShipmentCreated(uint256 shipmentId);
    event BreachDetected(uint256 shipmentId, uint256 breachDuration);
    event PenaltyExecuted(uint256 shipmentId, uint256 penaltyAmount);

    function createShipment(
        uint256 shipmentId,
        uint256 maxBreachDuration
    ) external payable {
        require(!shipments[shipmentId].active, "Shipment exists");

        shipments[shipmentId] = Shipment({
            maxBreachDuration: maxBreachDuration,
            escrowAmount: msg.value,
            logisticsPartner: msg.sender,
            active: true
        });

        emit ShipmentCreated(shipmentId);
    }

    function reportCompliance(
        uint256 shipmentId,
        uint256 breachDuration
    ) external {
        Shipment storage s = shipments[shipmentId];
        require(s.active, "Invalid shipment");

        if (breachDuration > s.maxBreachDuration) {
            uint256 penalty = s.escrowAmount / 10;
            payable(msg.sender).transfer(penalty);

            emit BreachDetected(shipmentId, breachDuration);
            emit PenaltyExecuted(shipmentId, penalty);
        }
    }
}

