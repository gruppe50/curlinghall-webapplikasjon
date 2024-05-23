package com.example.minimes.opcua;

import org.eclipse.milo.opcua.stack.core.types.builtin.NodeId;
import org.w3c.dom.Node;

public enum PLC_TAG {
    BIGLANE_TRACK_4_TEMP_MID(new NodeId(2,1)),
    BIGLANE_TRACK_4_TEMP_END(new NodeId(2,2)),
    SMALLLANE_TRACK_1_TEMP_MID(new NodeId(2,3)),
    SMALLLANE_TRACK_1_TEMP_END(new NodeId(2,4)),
    HALL_TEMP(new NodeId(2,5)),
    HALL_HUMIDITY(new NodeId(2,6)),
    GLYCOL_OUT_TEMP(new NodeId(2,7)),
    GLYCOL_IN_TEMP(new NodeId(2,8)),
    PRESSURE_COND(new NodeId(2,9));
    private final NodeId nodeId;


    PLC_TAG(NodeId nodeId) {
        this.nodeId = nodeId;
    }

    public NodeId getNodeId() {
        return nodeId;
    }
}
